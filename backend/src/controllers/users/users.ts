import bcrypt from "bcrypt";
import { RequestHandler } from "express";
import * as Http_Errors from "../../errors/http_errors";
import UserModel from "../../models/users/user";
import { assertIsDefined } from "../../util/assertIsDefined";

/** "Type" of the HTTP request body when signing up. */
interface SignUpBody {
  email?: string;
  password?: string;
}

/** "Type" of the HTTP request body when logging in. */
interface LogInBody {
  email?: string;
  password?: string;
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
 * Add a new user to the database and log them in.
 *  - Prerequisite: An existing user with the same email must not exist in the database.
 *  - Params: None
 *  - Body: email, password
 *  - Return: User
 */
export const signUp: RequestHandler<unknown, unknown, SignUpBody, unknown> = async (
  req,
  res,
  next
) => {
  const email = req.body.email;
  const passwordRaw = req.body.password;
  try {
    // Validate the existance of the credentials
    if (!email || !passwordRaw) throw new Http_Errors.MissingField();

    // Check if the email is already in use
    const existingEmail = await UserModel.findOne({ email: email });
    if (existingEmail) throw new Http_Errors.AlreadyExists("User with this email");

    // Hash the password
    const hashedPassword = await bcrypt.hash(passwordRaw, 10);

    // Send the request to create the user
    const newUser = await UserModel.create({
      email: email,
      password: hashedPassword,
      _buyer: null,
      _vendor: null,
    });

    // Set up a session
    req.session.userId = newUser._id;
    req.session.buyerId = newUser._buyer;
    req.session.vendorId = newUser._vendor;

    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};

/** 
 * Login an existing user by creating a new session.
 *  - Prerequisite: None
 *  - Params: None
 *  - Body: email, password
 *  - Return: User
 */
export const login: RequestHandler<unknown, unknown, LogInBody, unknown> = async (
  req,
  res,
  next
) => {
  const email = req.body.email;
  const passwordRaw = req.body.password;
  try {
    // Validate the existance of the credentials
    if (!email || !passwordRaw) throw new Http_Errors.MissingField();

    // Check if the user exists
    const user = await UserModel.findOne({ email: email }).select("+password").exec();
    if (!user) throw new Http_Errors.InvalidField("credentials");

    // Check if the password is correct
    const isValidPassword = await bcrypt.compare(passwordRaw, user.password);
    if (!isValidPassword) throw new Http_Errors.InvalidField("credentials");

    // Set up a session
    req.session.userId = user._id;
    req.session.buyerId = user._buyer;
    req.session.vendorId = user._vendor;

    res.status(200).json(user);
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
export const logout: RequestHandler<unknown, unknown, unknown, unknown> = async (
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
