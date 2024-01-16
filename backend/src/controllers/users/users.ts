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

/** "Type" of the HTTP request body when linking a user's account. */
interface LinkBody {
  identifier?: "form" | "google" | "gitHub";
  email?: string;
  password?: string;
  token?: string;
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
      if (!searchedUser) throw new Http_Errors.InvalidField("email");
      const isValidPassword = await bcrypt.compare(passwordRaw, searchedUser.password!);
      if (!isValidPassword) throw new Http_Errors.InvalidField("password");

      // Remove the password field from the user object
      searchedUser.password = undefined;
      returnUser = searchedUser;
    }

    // Part 5: Set up a session and return the user
    req.session.userId = returnUser._id;
    req.session.buyerId = returnUser._buyer;
    req.session.vendorId = returnUser._vendor;
    res.status(isSignUp ? 201 : 200).json(returnUser);
  } catch (error) {
    next(error);
  }
};

/**
 * Given the google jwt token, retrieve the user's unique Google ID.
 * @param token The google jwt token
 * @returns The user's unique Google ID
 */
async function getGoogleId(token: string): Promise<string | undefined> {
  try {
    // Part 1: Verify the validity of the token
    const client = new OAuth2Client();
    const ticket: LoginTicket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    // Part 2: Retrieve the user's unique Google ID
    const payload: TokenPayload | undefined = ticket.getPayload();
    return payload?.sub;
  } catch (error) {
    return Promise.reject(error);
  }
}

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

    // Part 2: Retrieve the user's unique Google ID
    const sub: string | undefined = await getGoogleId(token);
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
    res.status(isSignUp ? 201 : 200).json(returnUser);
  } catch (error) {
    next(error);
  }
};

/**
 * Given the code, retrieve the user's GitHub ID.
 * @param code The code given by GitHub
 * @returns The user's GitHub ID
 */
async function getGitHubId(code: string): Promise<number> {
  let requestUrl: string;
  try {
    // Part 1: Send request to GitHub to retrieve the token
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

    // Part 2: Retrieve the user's data
    requestUrl = "https://api.github.com/user";
    const userResponse = await fetch(requestUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessData.access_token}`,
      },
    });
    const userData = await userResponse.json();

    // Part 3: Return the user's GitHub ID
    return userData.id;
  } catch (error) {
    return Promise.reject(error);
  }
}

/**
 * Add a new user to the database given GitHub's code and log them in.
 *  - Prerequisite: An existing user with the same email must not exist in the database.
 *  - Params: None
 *  - Body: code: string
 *  - Return: User
 */
export const authenticateGitHub: RequestHandler<unknown, unknown, GitHubBody, unknown> = async (
  req,
  res,
  next
) => {
  const code = req.body.code;
  try {
    // Part 1: Verify existance of the code
    if (!code) throw new Http_Errors.MissingField();

    // Part 2: Send request to GitHub to retrieve the token
    const gitHubId = await getGitHubId(code);
    if (!gitHubId) throw new Http_Errors.InvalidField("code");

    let returnUser, returnStatus;
    // Part 4: Retrieve any user with a matching GitHub ID, create a new user if none exists
    const searchedUser = await UserModel.findOne({ "identification.gitHubId": gitHubId });
    if (!searchedUser) {
      returnUser = await UserModel.create({
        identification: { email: null, googleId: null, gitHubId: gitHubId },
        password: null,
        _buyer: null,
        _vendor: null,
      });
      returnStatus = 201;
    } else {
      returnUser = searchedUser;
      returnStatus = 200;
    }

    // Part 5: Set up a session and return the user
    req.session.userId = returnUser._id;
    req.session.buyerId = returnUser._buyer;
    req.session.vendorId = returnUser._vendor;
    res.status(returnStatus).json(returnUser);
  } catch (error) {
    next(error);
  }
};

/**
 * Link an additional authentication method to an existing user.
 *  - Prerequisite:
 *    - User's id must exist in session.
 *    - An existing user with the same identifier must not exist in the database.
 *  - Params: None
 *  - Body: identifier: "form" | "google" | "github", email: string, password: string, token: string
 *  - Return: User
 */
export const linkAuthentication: RequestHandler<unknown, unknown, LinkBody, unknown> = async (
  req,
  res,
  next
) => {
  const identifier = req.body.identifier;
  try {
    // Part 1: Verify existance of the arguments
    if (!identifier) throw new Http_Errors.MissingField();
    else if (identifier !== "form" && identifier !== "google" && identifier !== "gitHub")
      throw new Http_Errors.InvalidField("identifier");

    // If the identifier is "form", verify the existance of the email and password
    if (identifier === "form" && (!req.body.email || !req.body.password))
      throw new Http_Errors.MissingField();
    // Otherwise, verify the existance of the token
    else if ((identifier === "google" || identifier === "gitHub") && !req.body.token)
      throw new Http_Errors.MissingField();

    // Part 2: Retrieve the user
    assertIsDefined(req.session.userId);
    const user = await UserModel.findById(req.session.userId).exec();
    if (!user) throw new Http_Errors.NotFound("User");

    // Part 3: Update the user's identification depending on the identifier
    const updatedIdentification = user.identification;
    // Linking Form
    if (identifier === "form") {
      const searchedUser = await UserModel.findOne({ "identification.email": req.body.email });
      if (searchedUser) throw new Http_Errors.AlreadyExists("User with this email");

      const hashedPassword = await bcrypt.hash(req.body.password!, 10);
      updatedIdentification.email = req.body.email;
      user.password = hashedPassword;
    }

    // Linking Google
    else if (identifier === "google") {
      const sub: string | undefined = await getGoogleId(req.body.token!);
      if (!sub) throw new Http_Errors.InvalidField("token");

      const searchedUser = await UserModel.findOne({ "identification.googleId": sub });
      if (searchedUser) throw new Http_Errors.AlreadyExists("User with this Google account");

      updatedIdentification.googleId = sub;
    }

    // Linking GitHub
    else {
      const gitHubId = await getGitHubId(req.body.token!);
      if (!gitHubId) throw new Http_Errors.InvalidField("code");

      const searchedUser = await UserModel.findOne({ "identification.gitHubId": gitHubId });
      if (searchedUser) throw new Http_Errors.AlreadyExists("User with this GitHub account");

      updatedIdentification.gitHubId = gitHubId.toString();
    }

    // Part 4: Update the user's identification in the database
    user.identification = updatedIdentification;
    const returnUser = await user.save();
    res.status(200).json(returnUser);
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
