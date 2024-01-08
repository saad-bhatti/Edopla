import { IncomingMessage, Server, ServerResponse } from "http";
import request from "supertest";
import testApp from "../testApp";
import VendorModel from "../../models/users/vendor";
import UserModel from "../../models/users/user";
import * as Interfaces from "../../util/interfaces";
import { isUser } from "../../util/typeGuard";
import env from "../../util/validateEnv";
import * as Data from "../initialization/addUsersData";
import * as Database from "../mongodbMemoryServer";
import getCookies from "../helper/getCookies";
import { compareExisting, prepareVendorDetails, testNew } from "../helper/usersHelper";

/*********************************************************************
 * Note: All tests in this file depend on the success of logging in. *
 *********************************************************************/

/** The server instance. */
let server: Server<typeof IncomingMessage, typeof ServerResponse> | undefined;

/** Test data. */
const emails = ["user001@test.com", "user002@test.com", "user003@test.com"];
let users: Interfaces.User[];
let vendors: Interfaces.Vendor[];
let cookies: string[];

/**
 * Connect to the database, add users to it, create a profile profile only for the first user, and
 * create the server. Afterwards, get the authentication cookie for each user.
 *
 * User 1: Has a vendor profile.
 * User 2: Does not initially have a vendor profile but will have one created.
 * User 3: Will not have a vendor profile.
 */
beforeAll(async () => {
  await Database.connect();
  users = await Data.addUsers(emails);
  vendors = await Data.addVendors([users[0]]);
  server = await testApp.listen(env.TEST_PORT);
  cookies = await getCookies(emails);
});

/** Close the database connection and the server. */
afterAll(async () => {
  await Database.close();
  server?.close();
});

/** Tests for the getVendor route. */
describe("GET /api/vendors", () => {
  /** Test for successful retrieval of a vendor profile. */
  it("should be able to retrieve a vendor profile successfully", async () => {
    // Prepare the vendor details without selected details for testing
    const expectedVendor = prepareVendorDetails(users[0].email, false);

    // Send the request
    const response: request.Response = await request(testApp)
      .get("/api/vendors")
      .set("Cookie", cookies[0]);

    // Response status code check
    expect(response.statusCode).toBe(200);

    // Response body check
    const actualVendor = JSON.parse(response.text);
    compareExisting(actualVendor, expectedVendor);
  });

  /** Test for a user without a vendor profile. */
  it("should not be able to retrieve a vendor profile successfully due to no profile", async () => {
    // Send the request
    const response: request.Response = await request(testApp)
      .get("/api/vendors")
      .set("Cookie", cookies[2]);

    // Response status code check
    expect(response.statusCode).toBe(401);
  });
});

/** Tests for the create vendor profile route. */
describe("POST /api/vendors/", () => {
  /** Test for successful creation of a vendor profile. */
  it("should be able to create a vendor profile successfully", async () => {
    // Prepare the vendor details without selected details for creation
    const requestBody = prepareVendorDetails(users[1].email, false);

    // Send the request
    const response: request.Response = await request(testApp)
      .post("/api/vendors")
      .send(requestBody)
      .set("Cookie", cookies[1]);

    // Response status code check
    expect(response.statusCode).toBe(201);

    // Response body check
    const actualVendor = JSON.parse(response.text);
    testNew(actualVendor, requestBody);

    // Check that the buyer profile was added to the user
    const actualUser: Interfaces.User | null = await UserModel.findById(users[1]._id);
    if (!isUser(actualUser)) fail("The user was not found.");
    if (!actualUser._vendor) fail("The vendor profile was not added to the user.");
    expect(actualUser._vendor.toString()).toBe(actualVendor._id.toString());
  });

  /** Test for missing authentication. */
  it("should not be able to create a vendor profile with missing authentication", async () => {
    // Prepare the vendor details without selected details for creation
    const requestBody = prepareVendorDetails(users[2].email, false);

    // Send the request
    const response: request.Response = await request(testApp).post("/api/vendors").send(requestBody);

    // Response status code check
    expect(response.statusCode).toBe(401);
  });

  /** Test for missing argument. */
  it("should not be able to create a vendor profile with a missing argument", async () => {
    // Prepare the vendor details without selected details for creation and without a vendor name
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { vendorName, ...missingVendorDetails } = prepareVendorDetails(users[2].email, false);

    // Send the request
    const response: request.Response = await request(testApp)
      .post("/api/vendors")
      .send(missingVendorDetails)
      .set("Cookie", cookies[2]);

    // Response status code check
    expect(response.statusCode).toBe(400);
  });

  /** Test for an existing vendor profile. */
  it("should not be able to create a vendor profile for a user with existing profile", async () => {
    // Prepare the buyer details without selected details for creation
    const requestBody = prepareVendorDetails(users[0].email, false);

    // Send the request
    const response: request.Response = await request(testApp)
      .post("/api/vendors")
      .send(requestBody)
      .set("Cookie", cookies[0]);

    // Response status code check
    expect(response.statusCode).toBe(409);
  });
});

/** Tests for the update vendor profile route. */
describe("PATCH /api/vendors/", () => {
  /** Test for successful update of a vendor profile. */
  it("should be able to update a vendor profile successfully", async () => {
    // Prepare the vendor details without selected details for modification & testing
    const requestBody = prepareVendorDetails(`Updated ${users[0].email}`, false);

    // Send the request
    const response: request.Response = await request(testApp)
      .patch("/api/vendors")
      .send(requestBody)
      .set("Cookie", cookies[0]);

    // Response status code check
    expect(response.statusCode).toBe(200);

    // Response body check
    const expectedVendor = { ...requestBody, _id: vendors[0]._id };
    const actualVendor = JSON.parse(response.text);
    compareExisting(actualVendor, expectedVendor);
  });

  /** Test for missing authentication. */
  it("should not be able to update a vendor profile with missing authentication", async () => {
    // Prepare the vendor details without selected details for modification
    const requestBody = prepareVendorDetails(`Updated ${users[0].email}`, false);

    // Send the request
    const response: request.Response = await request(testApp).patch("/api/vendors").send(requestBody);

    // Response status code check
    expect(response.statusCode).toBe(401);
  });

  /** Test for missing argument. */
  it("should not be able to update a vendor profile with a missing argument", async () => {
    // Prepare the request body
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { vendorName, ...missingVendorDetails } = prepareVendorDetails(
      `Updated ${users[0].email}`,
      false
    );

    // Send the request
    const response: request.Response = await request(testApp)
      .patch("/api/vendors")
      .send(missingVendorDetails)
      .set("Cookie", cookies[0]);

    // Response status code check
    expect(response.statusCode).toBe(400);
  });

  /** Test for a non-existent vendor profile. */
  it("should not be able to update a buyer profile for a user without a profile", async () => {
    // Prepare the request body
    const requestBody = prepareVendorDetails(`Updated ${users[2].email}`, false);

    // Send the request
    const response: request.Response = await request(testApp)
      .patch("/api/vendors")
      .send(requestBody)
      .set("Cookie", cookies[2]);

    // Response status code check
    expect(response.statusCode).toBe(401);
  });
});

/** Tests for the toggle cuisine type route. */
describe("PATCH /api/vendors/cuisine", () => {
  /** Test for successful addition of a saved vendor. */
  it("should be able to add a cuisine type successfully", async () => {
    // Prepare the request body, where vendor 1 will add a cuisine type "Chinese"
    const requestBody = { cuisine: "Chinese" };
    const vendorId = vendors[0]._id;

    // Send the request
    const response: request.Response = await request(testApp)
      .patch("/api/vendors/cuisine")
      .send(requestBody)
      .set("Cookie", cookies[0]);

    // Response status code check
    expect(response.statusCode).toBe(200);

    // Response body check (ie check the correct cusine was returned)
    const expectedCuisine = requestBody.cuisine;
    const returnedCuisines = JSON.parse(response.text);
    expect(returnedCuisines.length).toBe(1);

    const returnedCuisine = returnedCuisines[0];
    compareExisting(returnedCuisine, expectedCuisine);

    // Check that the cuisine was added to the vendor's cuisines
    const actualVendor = await VendorModel.findById(vendorId);
    if (!actualVendor) fail("The vendor was not found.");
    if (actualVendor.cuisineTypes.length === 0) fail("The cuisine was not added.");

    const savedCuisine = actualVendor.cuisineTypes[0];
    expect(savedCuisine).toEqual(expectedCuisine);
  });

  /** Test for successful removal of a saved vendor. */
  it("should be able to remove a saved vendor successfully", async () => {
    // Prepare the request body, where vendor 1 will remove cuisine type "Chinese"
    const requestBody = { cuisine: "Chinese" };
    const vendorId = vendors[0]._id;

    // Send the request
    const response: request.Response = await request(testApp)
      .patch("/api/vendors/cuisine")
      .send(requestBody)
      .set("Cookie", cookies[0]);

    // Response status code check
    expect(response.statusCode).toBe(200);

    // Response body check (ie check an empty array was returned)
    const returnedCuisines = JSON.parse(response.text);
    expect(returnedCuisines.length).toBe(0);

    // Check that the cuisine was removed to the vendor's cuisines in the database
    const actualVendor = await VendorModel.findById(vendorId);
    if (!actualVendor) fail("The vendor was not found.");
    if (actualVendor.cuisineTypes.length !== 0) fail("The cuisine was not removed.");
  });

  /** Test for missing authentication. */
  it("should not be able to toggle a saved vendor with missing authentication", async () => {
    // Prepare the request body, where vendor 1 will attempt to add a cuisine type "Chinese"
    const requestBody = { cuisine: "Chinese" };

    // Send the request
    const response: request.Response = await request(testApp)
      .patch("/api/vendors/cuisine")
      .send(requestBody);

    // Response status code check
    expect(response.statusCode).toBe(401);
  });
});
