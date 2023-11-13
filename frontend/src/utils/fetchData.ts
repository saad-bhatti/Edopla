import { ConflictError, ForbiddenError, UnauthorizedError } from "../errors/http_errors";

/** 
 * Function to create & send an HTTP request to the backend server.
 * @param input The URL to send the request to.
 * @param init The request options.
 * @returns A promise that resolves to rhe response from the server on success. Otherwise, throws an
 * error on failure. 
 */
export async function fetchData(input: RequestInfo, init?: RequestInit) {
  const response = await fetch(input, init);
  if (response.ok) return response;
  else {
    const errorBody = await response.json();
    const errorMessage = errorBody.error;
    switch (response.status) {
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
