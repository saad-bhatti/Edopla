import { ConflictError, ForbiddenError, UnauthorizedError } from "../errors/http_errors";

/**
 * Function to create & send an HTTP request to the backend server.
 * @param input The URL to send the request to.
 * @param init The request options.
 * @param errorOptions A map of status codes to error messages to override the default error
 * @returns A promise that resolves to rhe response from the server on success. Otherwise, throws an
 * error on failure.
 */
export async function fetchData(
  input: RequestInfo,
  init?: RequestInit,
  errorOptions?: Map<number, string>
) {
  const requestInit: RequestInit = init
    ? { ...init, credentials: "include" }
    : { credentials: "include" };
  const response = await fetch(input, requestInit);
  if (response.ok) return response;
  else {
    const statusCode = response.status;
    const errorBody = await response.json();

    const defaultErrorMessage = errorBody.error;
    const customErrorMessage = errorOptions?.get(statusCode);
    const errorMessage = !customErrorMessage ? defaultErrorMessage : customErrorMessage;

    switch (statusCode) {
      case 401:
        throw new UnauthorizedError(errorMessage);
      case 403:
        throw new ForbiddenError(errorMessage);
      case 409:
        throw new ConflictError(errorMessage);
      default:
        throw new Error(
          "Request failed with status: " + response.status + " and message: " + errorMessage
        );
    }
  }
}
