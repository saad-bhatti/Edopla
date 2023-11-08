export class Http_Error extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = this.constructor.name;
    this.status = status;
  }
}

/** A custom error class for HTTP errors. */
export class CustomError extends Http_Error {
  constructor(message: string, status: number) {
    super(message, status);
  }
}

/** 400 status: error thrown when a request's body is missing a field. */
export class MissingField extends Http_Error {
  constructor() {
    super("A required field is missing", 400);
  }
}

/** 401 status: error thrown when a request is unauthorized. */
export class Unauthorized extends Http_Error {
  constructor(client: string, item: string) {
    super(`${client} does not have access to the ${item}`, 401);
  }
}

/** 422 status: error thrown when a request's field is invalid. */
export class InvalidField extends Http_Error {
  constructor(item: string) {
    super(`Invalid ${item}`, 422);
  }
}

/** 404 status: error thrown when a resource is not found. */
export class NotFound extends Http_Error {
  constructor(item: string) {
    super(`${item} not found`, 404);
  }
}

/** 409 status: error thrown when a resource already exists. */
export class AlreadyExists extends Http_Error {
  constructor(item: string) {
    super(`${item} already exists`, 409);
  }
}
