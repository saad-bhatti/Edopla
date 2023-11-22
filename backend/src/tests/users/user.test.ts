import bcrypt from "bcrypt";
import { IncomingMessage, Server, ServerResponse } from "http";
import request from "supertest";
import app from "../../app";
import * as Interfaces from "../../util/interfaces";
import env from "../../util/validateEnv";
import * as Data from "../mockDB/data/usersData";
import * as Database from "../mockDB/mongodbMemoryServer";

/** The server instance. */
let server: Server<typeof IncomingMessage, typeof ServerResponse> | undefined;
/** The users initialized in the database. */
let users: Interfaces.User[];
/** The cookie to be used for authentication. */
let cookie: string;

beforeAll(async () => {
  await Database.connect();
  users = await Data.addUsers(["user001@test.com", "user002@test.com"]);
  server = await app.listen(env.PORT);
});

afterAll(async () => {
  await Database.close();
  server?.close();
});

/** Tests for the signup route. */
describe("POST /api/users/signup", () => {
  /** Test for successful login. */
  it("should be able to sign up successfully", async () => {
    // Prepare the expected user
    const expectedEmail = "user003@test.com";
    const expectedPassword = "test123";

    // Send the request
    const response: request.Response = await request(app)
      .post("/api/users/signup")
      .send({ email: expectedEmail, password: expectedPassword });

    // Response status code check
    expect(response.statusCode).toBe(201);

    // Response body check
    const actualUser = JSON.parse(response.text);
    expect(actualUser).toHaveProperty("_id");
    expect(actualUser.email).toBe(expectedEmail);
    expect(bcrypt.compareSync(expectedPassword, actualUser.password)).toBe(true);
  });

  /** Test for missing credentials. */
  it("should not be able to log in with a missing credential", async () => {
    // Send the request
    const response: request.Response = await request(app).post("/api/users/signup").send({
      email: "user003@test.com",
    });
    expect(response.statusCode).toBe(400);
  });
});

/** Tests for the login route. */
describe("POST /api/users/login", () => {
  /** Test for successful login. */
  it("should be able to log in successfully", async () => {
    // Send the request
    const response: request.Response = await request(app).post("/api/users/login").send({
      email: "user001@test.com",
      password: "test123",
    });
    // Response status code check
    expect(response.statusCode).toBe(200);

    // Response body check
    const actualUser = JSON.parse(response.text);
    const expectedUser = users[0];
    compareUsers(actualUser, expectedUser);

    // Take the cookie for another test
    cookie = response.headers["set-cookie"];
  });

  /** Test for missing credentials. */
  it("should not be able to log in with a missing credential", async () => {
    // Send the request
    const response: request.Response = await request(app).post("/api/users/login").send({
      email: "user001@test.com",
    });
    expect(response.statusCode).toBe(400);
  });

  /** Test for incorrect credentials. */
  it("should not be able to log in with incorrect credentials", async () => {
    // Send the request
    const response: request.Response = await request(app).post("/api/users/login").send({
      email: "user001@test.com",
      password: "test1234",
    });
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
    const response: request.Response = await request(app).get("/api/users").set("Cookie", cookie);

    // Response status code check
    expect(response.statusCode).toBe(200);

    // Response body check
    const actualUser = JSON.parse(response.text);
    const expectedUser = users[0];
    compareUsers(actualUser, expectedUser);
  });

  /** Test for unauthenticated user. */
  it("should not be able to retrieve an unauthenticated user", async () => {
    // Send the request
    const response: request.Response = await request(app).get("/api/users");

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
    const response: request.Response = await request(app)
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
    const response: request.Response = await request(app).post("/api/users/logout");

    // Response status code check
    expect(response.statusCode).toBe(401);
  });
});

/**
 * Function to assert the equality of two users.
 * @param actualUser The user to be tested.
 * @param expectedUser The expected user.
 * @returns Nothing.
 */
function compareUsers(actualUser: Interfaces.User, expectedUser: Interfaces.User): void {
  expect(actualUser._id.toString()).toEqual(expectedUser._id.toString());
  expect(actualUser.email).toBe(expectedUser.email);
  if (actualUser.password) expect(actualUser.password).toBe(expectedUser.password);
  if (!expectedUser._buyer) expect(actualUser._buyer).toBeUndefined();
  if (!expectedUser._vendor) expect(actualUser._vendor).toBeUndefined();
}
