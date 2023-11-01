import bcrypt from "bcrypt";
import { RequestHandler } from "express";
import createHttpError from "http-errors";
import UserModel from "../../models/users/user";

/** Retrieve an authenticated user from the database. */
export const getAuthenticatedUser: RequestHandler = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.session.userId).exec();
    if (!user) throw createHttpError(404, "User not found");

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

// "Type" of the HTTP request body when signing up
interface SignUpBody {
  email?: string;
  password?: string;
}

/** Add a new user to the database and log them in. */
export const signUp: RequestHandler<unknown, unknown, SignUpBody, unknown> = async (
  req,
  res,
  next
) => {
  const email = req.body.email;
  const passwordRaw = req.body.password;
  try {
    // Validate the existance of the credentials
    if (!email || !passwordRaw)
      throw createHttpError(400, "A required credential is missing");

    // Check if the email is already in use
    const existingEmail = await UserModel.findOne({ email: email });
    if (existingEmail) throw createHttpError(409, "Email already in use");

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

// "Type" of the HTTP request body when logging in
interface LogInBody {
  email?: string;
  password?: string;
}

/** Login an existing user by creating a new session. */
export const login: RequestHandler<unknown, unknown, LogInBody, unknown> = async (
  req,
  res,
  next
) => {
  const email = req.body.email;
  const passwordRaw = req.body.password;
  try {
    // Validate the existance of the credentials
    if (!email || !passwordRaw) throw createHttpError(400, "A required credential is missing");

    // Check if the user exists
    const user = await UserModel.findOne({ email: email }).select("+password").exec();
    if (!user) throw createHttpError(401, "Invalid credentials");

    // Check if the password is correct
    const isValidPassword = await bcrypt.compare(passwordRaw, user.password);
    if (!isValidPassword) throw createHttpError(401, "Invalid credentials");

    // Set up a session
    req.session.userId = user._id;
    req.session.buyerId = user._buyer;
    req.session.vendorId = user._vendor;

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

/** Logout an existing user by destroying the current session. */
export const logout: RequestHandler = async (req, res, next) => {
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
