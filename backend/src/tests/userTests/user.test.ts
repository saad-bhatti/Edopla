import { IncomingMessage, Server, ServerResponse } from "http";
import request from "supertest";
import testApp from "../testApp";
import * as Interfaces from "../../util/interfaces";
import env from "../../util/validateEnv";
import * as Data from "../initialization/addUsersData";
import * as Database from "../mongodbMemoryServer";
import { compareExisting, prepareUserDetails, testNew } from "../helper/usersHelper";

/** The server instance. */
let server: Server<typeof IncomingMessage, typeof ServerResponse> | undefined;

/** Test data. */
const emails = ["user001@test.com", "user002@test.com"];
let users: Interfaces.User[];
let cookie: string;

/** Connect to the database, add users to it, and create the server. */
beforeAll(async () => {
  await Database.connect();
  users = await Data.addUsers(emails);
  server = await testApp.listen(env.TEST_PORT);
});

/** Close the database connection and the server. */
afterAll(async () => {
  await Database.close();
  server?.close();
});

/** Tests for the signup route. */
describe("POST /api/users/signup", () => {
  /** Test for successful login. */
  it("should be able to sign up successfully", async () => {
    // Prepare the user details
    const expectedUserDetails = prepareUserDetails("user003@gmail.com");

    // Send the request
    const response: request.Response = await request(testApp)
      .post("/api/users/signup")
      .send(expectedUserDetails);

    // Response status code check
    expect(response.statusCode).toBe(201);

    // Response body check
    const actualUser = JSON.parse(response.text);
    testNew(actualUser, expectedUserDetails);
  });

  /** Test for missing credentials. */
  it("should not be able to log in with a missing credential", async () => {
    // Prepare the user details (but with missing credential)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...missingUserDetails } = prepareUserDetails("user003@gmail.com");

    // Send the request
    const response: request.Response = await request(testApp)
      .post("/api/users/signup")
      .send(missingUserDetails);

    // Response status code check
    expect(response.statusCode).toBe(400);
  });

  /** Test for existing user. */
  it("should not be able to sign up an existing user", async () => {
    // Prepare the user details
    const expectedUserDetails = prepareUserDetails(users[0].email);

    // Send the request
    const response: request.Response = await request(testApp)
      .post("/api/users/signup")
      .send(expectedUserDetails);

    // Response status code check
    expect(response.statusCode).toBe(409);
  });
});

/** Tests for the login route. */
describe("POST /api/users/login", () => {
  /** Test for successful login. */
  it("should be able to log in successfully", async () => {
    // Prepare the user details
    const expectedUserDetails = prepareUserDetails(users[0].email);

    // Send the request
    const response: request.Response = await request(testApp)
      .post("/api/users/login")
      .send(expectedUserDetails);

    // Response status code check
    expect(response.statusCode).toBe(200);

    // Response body check
    const actualUser = JSON.parse(response.text);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...expectedUser } = users[0]; // Since password is never returned, remove it
    compareExisting(actualUser, expectedUser);

    // Take the cookie for another test
    cookie = response.headers["set-cookie"];
  });

  /** Test for missing credentials. */
  it("should not be able to log in with a missing credential", async () => {
    // Prepare the user details (but with missing credential)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...missingUserDetails } = prepareUserDetails(users[0].email);

    // Send the request
    const response: request.Response = await request(testApp)
      .post("/api/users/login")
      .send(missingUserDetails);

    // Response status code check
    expect(response.statusCode).toBe(400);
  });

  /** Test for incorrect credentials. */
  it("should not be able to log in with incorrect credentials", async () => {
    // Prepare the user details (but with incorrect email)
    const incorrectUserDetails = prepareUserDetails("user005@test.com");

    // Send the request
    const response: request.Response = await request(testApp)
      .post("/api/users/login")
      .send(incorrectUserDetails);

    // Response status code check
    expect(response.statusCode).toBe(422);
  });
});

/** Tests for the getAuthenticatedUser route. */
describe("GET /api/users", () => {
  /**
   * Test for successful retrieval of an authenticated user. Note this test depends on the success
   * of the login test.
   */
  it("should be able to retrieve an authenticated user", async () => {
    // Send the request
    const response: request.Response = await request(testApp).get("/api/users").set("Cookie", cookie);

    // Response status code check
    expect(response.statusCode).toBe(200);

    // Response body check
    const actualUser = JSON.parse(response.text);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...expectedUser } = users[0]; // Since password is never returned, remove it
    compareExisting(actualUser, expectedUser);
  });

  /** Test for unauthenticated user. */
  it("should not be able to retrieve an unauthenticated user", async () => {
    // Send the request
    const response: request.Response = await request(testApp).get("/api/users");

    // Response status code check
    expect(response.statusCode).toBe(401);
  });
});

/** Tests for the logout route. */
describe("POST /api/users/logout", () => {
  /**
   * Test for successful logout. Note this test depends on the success of the login test.
   */
  it("should be able to log out successfully", async () => {
    // Send the request
    const response: request.Response = await request(testApp)
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
    const response: request.Response = await request(testApp).post("/api/users/logout");

    // Response status code check
    expect(response.statusCode).toBe(401);
  });
});