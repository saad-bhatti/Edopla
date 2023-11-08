import { RequestHandler } from "express";
import { CustomError } from "../errors/http_errors";

/** Middleware to check if a user is authenticated. */
export const requiresAuth: RequestHandler = (req, res, next) => {
  if (req.session.userId) next();
  else next(new CustomError("User not authenticated", 401));
};

/** Middleware to check if a user is a buyer. */
export const requiresBuyer: RequestHandler = (req, res, next) => {
  if (req.session.buyerId) next();
  else next(new CustomError("User does not have a buyer profile", 401));
};

/** Middleware to check if a user is a vendor. */
export const requiresVendor: RequestHandler = (req, res, next) => {
  if (req.session.vendorId) next();
  else next(new CustomError("User does not have a vendor profile", 401));
};
