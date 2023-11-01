import { RequestHandler } from "express";
import createHttpError from "http-errors";

/** Middleware to check if a user is authenticated. */
export const requiresAuth: RequestHandler = (req, res, next) => {
  if (req.session.userId) next();
  else next(createHttpError(401, "User not authenticated"));
};

/** Middleware to check if a user is a buyer. */
export const requiresBuyer: RequestHandler = (req, res, next) => {
  if (req.session.buyerId) next();
  else next(createHttpError(401, "User does not have a buyer profile"));
};

/** Middleware to check if a user is a vendor. */
export const requiresVendor: RequestHandler = (req, res, next) => {
  if (req.session.vendorId) next();
  else next(createHttpError(401, "User does not have a vendor profile"));
};
