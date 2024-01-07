/**************************************************************************************************
 * This file contains the custom HttpError class and its subclasses.                              *
 **************************************************************************************************/

/**
 * Custom error class for HTTP errors.
 * @param message The error message.
 * @returns An instance of the HttpError class.
 * @constructor Creates an instance of the HttpError class.
 * @extends Error The base Error class.
 */
class HttpError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

/**
 * 401 status: error thrown when an unauthorized request is made to a resource.
 */
export class UnauthorizedError extends HttpError {}

/**
 * 403 status: error thrown when a forbidden request is made to a resource.
 */
export class ForbiddenError extends HttpError {}

/**
 * 409 status: error thrown when a request is made to a resource that conflicts
 * with another resource.
 */
export class ConflictError extends HttpError {}

/**
 * 422 status: error thrown when a request contains an invalid field.
 */
export class InvalidFieldError extends HttpError {}
