import request from "supertest";
import { testEmails } from "../helper/databaseRequests";
import {
  compareExisting,
  prepareUserFormDetails,
  prepareUserFormRequestBody,
  testNew,
} from "../helper/usersHelper";

const url = "http://localhost:5001";
let cookie: string;

/** Initialize the database before all tests. */
beforeAll(async () => {
  const response: request.Response = await request(url).post("/api/database/initialize/profiles");
  console.log(response.text);
});

/** Clear the database after all tests. */
afterAll(async () => {
  const response: request.Response = await request(url).delete("/api/database/clear/profiles");
  console.log(response.text);
});

/** Tests for the authentication route. */
describe("POST /api/users/authenticate/form/", () => {
  /** Test for successful sign up. */
  it("should be able to sign up successfully", async () => {
    // Prepare the request body
    const requestBody = prepareUserFormRequestBody(true, "newuser@test.com");

    // Send the request
    const response: request.Response = await request(url)
      .post("/api/users/authenticate/form")
      .send(requestBody);

    // Response status code check
    expect(response.statusCode).toBe(201);

    // Prepare the user details
    const expectedUserDetails = prepareUserFormDetails("newuser@test.com");

    // Response body check
    const actualUser = JSON.parse(response.text);
    testNew(actualUser, expectedUserDetails);
  });

  /** Test for missing credentials. */
  it("should not be able to sign up with a missing credential", async () => {
    // Prepare the user details (but with missing credential)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...missingRequestBody } = prepareUserFormRequestBody(true, "jest03@test.com");

    // Send the request
    const response: request.Response = await request(url)
      .post("/api/users/authenticate/form")
      .send(missingRequestBody);

    // Response status code check
    expect(response.statusCode).toBe(400);
  });

  /** Test for existing user. */
  it("should not be able to sign up an existing user", async () => {
    // Prepare the user details
    const requestBody = prepareUserFormRequestBody(true, testEmails[0]);

    // Send the request
    const response: request.Response = await request(url)
      .post("/api/users/authenticate/form")
      .send(requestBody);

    // Response status code check
    expect(response.statusCode).toBe(409);
  });

  /** Test for successful log in. */
  it("should be able to log in successfully", async () => {
    // Prepare the request body
    const requestBody = prepareUserFormRequestBody(false, testEmails[0]);

    // Send the request
    const response: request.Response = await request(url)
      .post("/api/users/authenticate/form")
      .send(requestBody);
    // Save the cookie
    cookie = response.header["set-cookie"];

    // Response status code check
    expect(response.statusCode).toBe(200);

    // Prepare the user details
    const expectedUserDetails = prepareUserFormDetails(testEmails[0]);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...expectedUser } = expectedUserDetails;

    // Response body check
    const actualUser = JSON.parse(response.text);
    compareExisting(actualUser, expectedUser);
  });

  /** Test for missing credentials. */
  it("should not be able to log in with a missing credential", async () => {
    // Prepare the user details (but with missing credential)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...missingRequestBody } = prepareUserFormRequestBody(false, testEmails[0]);

    // Send the request
    const response: request.Response = await request(url)
      .post("/api/users/authenticate/form")
      .send(missingRequestBody);

    // Response status code check
    expect(response.statusCode).toBe(400);
  });

  /** Test for incorrect credentials. */
  it("should not be able to log in with incorrect credentials", async () => {
    // Prepare the user details (but with incorrect email)
    const requestBody = prepareUserFormRequestBody(false, "jest10@test.com");
    requestBody.password = "incorrectPassword";

    // Send the request
    const response: request.Response = await request(url)
      .post("/api/users/authenticate/form")
      .send(requestBody);

    // Response status code check
    expect(response.statusCode).toBe(422);
  });
});

/** Tests for the getAuthenticatedUser route. */
describe("GET /api/users/", () => {
  /**
   * Test for successful retrieval of an authenticated user. Note this test depends on the success
   * of the login test.
   */
  it("should be able to retrieve an authenticated user", async () => {
    // Send the request
    const response: request.Response = await request(url).get("/api/users/").set("Cookie", cookie);

    // Response status code check
    expect(response.statusCode).toBe(200);

    // Response body check
    const actualUser = JSON.parse(response.text);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...expectedUser } = prepareUserFormDetails(testEmails[0]);
    compareExisting(actualUser, expectedUser);
  });

  /** Test for unauthenticated user. */
  it("should not be able to retrieve an unauthenticated user", async () => {
    // Send the request
    const response: request.Response = await request(url).get("/api/users/");

    // Response status code check
    expect(response.statusCode).toBe(401);
  });
});

/** Tests for the logout route. */
describe("POST /api/users/logout/", () => {
  /**
   * Test for successful logout. Note this test depends on the success of the login test.
   */
  it("should be able to log out successfully", async () => {
    // Send the request
    const response: request.Response = await request(url)
      .post("/api/users/logout")
      .set("Cookie", cookie);

    // Response status code check
    expect(response.statusCode).toBe(200);

    // Response body check
    const actualResponse = JSON.parse(response.text);
    const expectedResponse = { message: "User successfully logged out" };
    expect(actualResponse).toEqual(expectedResponse);
  });

  /** Test for unauthenticated user. */
  it("should not be able to log out an unauthenticated user", async () => {
    // Send the request
    const response: request.Response = await request(url).post("/api/users/logout");

    // Response status code check
    expect(response.statusCode).toBe(401);
  });
});
