import bcrypt from "bcrypt";
import { RequestHandler } from "express";
import * as Http_Errors from "../../errors/http_errors";
import UserModel from "../../models/users/user";
import { assertIsDefined } from "../../util/assertIsDefined";
import { LoginTicket, OAuth2Client, TokenPayload } from "google-auth-library";

/** "Type" of the HTTP request body when authenticating with a form. */
interface FormBody {
  isSignUp?: boolean;
  email?: string;
  password?: string;
}

/** "Type" of the HTTP request body when authenticating with a google JWT token. */
interface GoogleBody {
  isSignUp?: boolean;
  token?: string;
}

/** "Type" of the HTTP request body when authenticating with a GitHub code. */
interface GitHubBody {
  code?: string;
}

/**
 * Retrieve an authenticated user from the database.
 *  - Prerequisite: User's id must exist in session.
 *  - Params: None
 *  - Body: None
 *  - Return: User
 */
export const getAuthenticatedUser: RequestHandler<unknown, unknown, unknown, unknown> = async (
  req,
  res,
  next
) => {
  try {
    assertIsDefined(req.session.userId);
    const user = await UserModel.findById(req.session.userId).exec();
    if (!user) throw new Http_Errors.NotFound("User");

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

/**
 * Given the mode and credentials, either sign up and create a user or log in to an existing user
 * into the session.
 *  - Prerequisite: For sign up, a user with the same email must not already exist.
 *  - Params: None
 *  - Body: isSignUp: boolean, email: string, password: string
 *  - Return: User
 */
export const authenticationForm: RequestHandler<unknown, unknown, FormBody, unknown> = async (
  req,
  res,
  next
) => {
  const isSignUp = req.body.isSignUp;
  const email = req.body.email;
  const passwordRaw = req.body.password;
  try {
    // Part 1: Validate the existance of the arguments
    if (isSignUp === undefined || !email || !passwordRaw) throw new Http_Errors.MissingField();

    // Part 2: Retrieve any user with a matching email
    const searchedUser = await UserModel.findOne({ "identification.email": email })
      .select("+password")
      .exec();

    let returnUser;
    // Part 3: Handle the sign up case, by creating a new user
    if (isSignUp) {
      if (searchedUser) throw new Http_Errors.AlreadyExists("User with this email");
      const hashedPassword = await bcrypt.hash(passwordRaw, 10);

      returnUser = await UserModel.create({
        identification: { email: email, googleId: null, gitHubId: null },
        password: hashedPassword,
        _buyer: null,
        _vendor: null,
      });
    }

    // Part 4: Handle the log in case, by checking the password
    else {
      if (!searchedUser) throw new Http_Errors.InvalidField("credentials");
      const isValidPassword = await bcrypt.compare(passwordRaw, searchedUser.password!);
      if (!isValidPassword) throw new Http_Errors.InvalidField("credentials");

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userWithoutPassword } = searchedUser;
      returnUser = userWithoutPassword;
    }

    // Part 5: Set up a session and return the user
    req.session.userId = returnUser._id;
    req.session.buyerId = returnUser._buyer;
    req.session.vendorId = returnUser._vendor;
    res.status(201).json(returnUser);
  } catch (error) {
    next(error);
  }
};

/**
 * Given the mode and google jwt token, either sign up and create a user or log in to an existing
 * user into the session.
 *  - Prerequisite: For sign up, a user with the same google id must not already exist.
 *  - Params: None
 *  - Body: isSignUp: boolean, token: string
 *  - Return: User
 */
export const authenticationGoogle: RequestHandler<unknown, unknown, GoogleBody, unknown> = async (
  req,
  res,
  next
) => {
  const isSignUp = req.body.isSignUp;
  const token = req.body.token;
  try {
    // Part 1: Verify existance and validity of the arguments
    if (isSignUp === undefined || !token) throw new Http_Errors.MissingField();

    const client = new OAuth2Client();
    const ticket: LoginTicket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    // Part 2: Retrieve the user's unique Google ID
    const payload: TokenPayload | undefined = ticket.getPayload();
    const sub: string | undefined = payload?.sub;
    if (!sub) throw new Http_Errors.InvalidField("token");

    // Part 3: Retrieve any user with a matching sub
    const searchedUser = await UserModel.findOne({ "identification.googleId": sub });

    let returnUser;
    // Part 4: Handle the sign up case, by creating a new user
    if (isSignUp) {
      if (searchedUser) throw new Http_Errors.AlreadyExists("User with this google account");
      returnUser = await UserModel.create({
        identification: { email: null, googleId: sub, gitHubId: null },
        password: null,
        _buyer: null,
        _vendor: null,
      });
    }
    // Part 5: Handle the log in case
    else {
      if (!searchedUser) throw new Http_Errors.InvalidField("token");
      returnUser = searchedUser;
    }

    // Part 6: Set up a session and return the user
    req.session.userId = returnUser._id;
    req.session.buyerId = returnUser._buyer;
    req.session.vendorId = returnUser._vendor;
    res.status(201).json(returnUser);
  } catch (error) {
    next(error);
  }
};

/**
 * Add a new user to the database given GitHub's code and log them in.
 *  - Prerequisite: An existing user with the same email must not exist in the database.
 *  - Params: None
 *  - Body: token
 *  - Return: User
 */
export const authenticateGitHub: RequestHandler<unknown, unknown, GitHubBody, unknown> = async (
  req,
  res,
  next
) => {
  const code = req.body.code;
  let requestUrl: string;
  try {
    // Part 1: Verify existance of the code
    if (!code) throw new Http_Errors.MissingField();

    // Part 2: Send request to GitHub to retrieve the token
    const params =
      `?client_id=${process.env.GITHUB_CLIENT_ID}` +
      `&client_secret=${process.env.GITHUB_CLIENT_SECRET}` +
      `&code=${code}`;
    requestUrl = `https://github.com/login/oauth/access_token${params}`;
    const accessResponse = await fetch(requestUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    });
    const accessData = await accessResponse.json();

    // Part 3: Retrieve the user's GitHub ID
    requestUrl = "https://api.github.com/user";
    const userResponse = await fetch(requestUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessData.access_token}`,
      },
    });
    const userData = await userResponse.json();
    const gitHubId = userData.id;

    let returnUser;
    // Part 4: Retrieve any user with a matching GitHub ID, create a new user if none exists
    const searchedUser = await UserModel.findOne({ "identification.gitHubId": gitHubId }); 
    if (!searchedUser) {
      returnUser = await UserModel.create({
        identification: { email: null, googleId: null, gitHubId: gitHubId },
        password: null,
        _buyer: null,
        _vendor: null,
      });
    }
    else returnUser = searchedUser;
    
    // Part 5: Set up a session and return the user
    req.session.userId = returnUser._id;
    req.session.buyerId = returnUser._buyer;
    req.session.vendorId = returnUser._vendor;
    res.status(201).json(returnUser);
  } catch (error) {
    next(error);
  }
};

/**
 * Logout an existing user by destroying the current session.
 *  - Prerequisite: User's id must exist in session.
 *  - Params: None
 *  - Body: None
 *  - Return: String
 */
export const logOut: RequestHandler<unknown, unknown, unknown, unknown> = async (
  req,
  res,
  next
) => {
  try {
    // Destroy the session
    req.session.destroy((error) => {
      if (error) throw error;
    });

    res.status(200).json({ message: "User successfully logged out" });
  } catch (error) {
    next(error);
  }
};
