import { IncomingMessage, Server, ServerResponse } from "http";
import request from "supertest";
import BuyerModel from "../../models/users/buyer";
import UserModel from "../../models/users/user";
import * as Interfaces from "../../util/interfaces";
import { isUser } from "../../util/typeGuard";
import env from "../../util/validateEnv";
import getCookies from "../helper/getCookies";
import {
  compareExisting,
  prepareBuyerDetails,
  prepareVendorDetails,
  testNew,
} from "../helper/usersHelper";
import * as Data from "../initialization/addUsersData";
import * as Database from "../mongodbMemoryServer";
import testApp from "../testApp";

/********************************************************************
 * Note: All tests in this file depend on the success of logging in. *
 *********************************************************************/

/** The server instance. */
let server: Server<typeof IncomingMessage, typeof ServerResponse> | undefined;

/** Test data. */
const emails = ["user001@test.com", "user002@test.com", "user003@test.com"];
let users: Interfaces.User[];
let buyers: Interfaces.Buyer[];
let vendors: Interfaces.Vendor[];
let cookies: string[];

/**
 * Connect to the database, add users to it, create a buyer profile only for the first user, and
 * create the server. Afterwards, create a vendor profile for all users and then get the
 * authentication cookie for each user.
 *
 * User 1: Has a buyer profile.
 * User 2: Does not initially have a buyer profile but will have one created.
 * User 3: Will not have a buyer profile.
 */
beforeAll(async () => {
  await Database.connect();
  users = await Data.addUsers(emails);
  buyers = await Data.addBuyers([users[0]]);
  vendors = await Data.addVendors(users);
  server = await testApp.listen(env.TEST_PORT);
  cookies = await getCookies(emails);
});

/** Close the database connection and the server. */
afterAll(async () => {
  await Database.close();
  server?.close();
});

/** Tests for the getBuyer route. */
describe("GET /api/buyers", () => {
  /** Test for successful retrieval of a buyer profile. */
  it("should be able to retrieve a buyer profile successfully", async () => {
    // Prepare the buyer details without selected details for testing
    const email = users[0].identification.email || "";
    const expectedBuyer = prepareBuyerDetails(email, false);

    // Send the request
    const response: request.Response = await request(testApp)
      .get("/api/buyers")
      .set("Cookie", cookies[0]);

    // Response status code check
    expect(response.statusCode).toBe(200);

    // Response body check
    const actualBuyer = JSON.parse(response.text);
    compareExisting(actualBuyer, expectedBuyer);
  });

  /** Test for a user without a buyer profile. */
  it("should not be able to retrieve a buyer profile successfully due to no profile", async () => {
    // Send the request
    const response: request.Response = await request(testApp)
      .get("/api/buyers")
      .set("Cookie", cookies[2]);

    // Response status code check
    expect(response.statusCode).toBe(401);
  });

  /** Test for a retrieval with missing authentication. */
  it("should not be able to retrieve a buyer profile with missing authentication", async () => {
    // Send the request
    const response: request.Response = await request(testApp).get("/api/buyers");

    // Response status code check
    expect(response.statusCode).toBe(401);
  });
});

/** Tests for the create buyer profile route. */
describe("POST /api/buyers/", () => {
  /** Test for successful creation of a buyer profile. */
  it("should be able to create a buyer profile successfully", async () => {
    // Prepare the buyer details without selected details for creation
    const email = users[1].identification.email || "";
    const requestBody = prepareBuyerDetails(email, false);

    // Send the request
    const response: request.Response = await request(testApp)
      .post("/api/buyers")
      .send(requestBody)
      .set("Cookie", cookies[1]);

    // Response status code check
    expect(response.statusCode).toBe(201);

    // Response body check
    const actualBuyer = JSON.parse(response.text);
    testNew(actualBuyer, requestBody);

    // Check that the buyer profile was added to the user
    const actualUser: Interfaces.User | null = await UserModel.findById(users[1]._id);
    if (!isUser(actualUser)) fail("The user was not found.");
    if (!actualUser._buyer) fail("The buyer profile was not added to the user.");
    expect(actualUser._buyer.toString()).toBe(actualBuyer._id.toString());
  });

  /** Test for missing authentication. */
  it("should not be able to create a buyer profile with missing authentication", async () => {
    // Prepare the buyer details without selected details for creation
    const email = users[0].identification.email || "";
    const requestBody = prepareBuyerDetails(email, false);

    // Send the request
    const response: request.Response = await request(testApp).post("/api/buyers").send(requestBody);

    // Response status code check
    expect(response.statusCode).toBe(401);
  });

  /** Test for missing argument. */
  it("should not be able to create a buyer profile with a missing argument", async () => {
    // Prepare the buyer details without selected details for creation and without a buyer name
    const email = users[2].identification.email || "";
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { buyerName, ...missingBuyerDetails } = prepareBuyerDetails(email, false);

    // Send the request
    const response: request.Response = await request(testApp)
      .post("/api/buyers")
      .send(missingBuyerDetails)
      .set("Cookie", cookies[1]);

    // Response status code check
    expect(response.statusCode).toBe(400);
  });

  /** Test for an existing buyer profile. */
  it("should not be able to create a buyer profile for a user with existing profile", async () => {
    // Prepare the buyer details without selected details for creation
    const email = users[0].identification.email || "";
    const requestBody = prepareBuyerDetails(email, false);

    // Send the request
    const response: request.Response = await request(testApp)
      .post("/api/buyers")
      .send(requestBody)
      .set("Cookie", cookies[0]);

    // Response status code check
    expect(response.statusCode).toBe(409);
  });
});

/** Tests for the update buyer profile route. */
describe("PATCH /api/buyers/", () => {
  /** Test for successful update of a buyer profile. */
  it("should be able to update a buyer profile successfully", async () => {
    // Prepare the buyer details without selected details for modification & testing
    const email = users[0].identification.email || "";
    const requestBody = prepareBuyerDetails(`Updated ${email}`, false);

    // Send the request
    const response: request.Response = await request(testApp)
      .patch("/api/buyers")
      .send(requestBody)
      .set("Cookie", cookies[0]);

    // Response status code check
    expect(response.statusCode).toBe(200);

    // Response body check
    const expectedBuyer = { ...requestBody, _id: buyers[0]._id };
    const actualBuyer = JSON.parse(response.text);
    compareExisting(actualBuyer, expectedBuyer);
  });

  /** Test for missing authentication. */
  it("should not be able to update a buyer profile with missing authentication", async () => {
    // Prepare the buyer details without selected details for modification
    const email = users[0].identification.email || "";
    const requestBody = prepareBuyerDetails(`Updated ${email}`, false);

    // Send the request
    const response: request.Response = await request(testApp)
      .patch("/api/buyers")
      .send(requestBody);

    // Response status code check
    expect(response.statusCode).toBe(401);
  });

  /** Test for missing argument. */
  it("should not be able to update a buyer profile with a missing argument", async () => {
    // Prepare the request body
    const email = users[0].identification.email || "";
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { buyerName, ...missingBuyerDetails } = prepareBuyerDetails(`Updated ${email}`, false);

    // Send the request
    const response: request.Response = await request(testApp)
      .patch("/api/buyers")
      .send(missingBuyerDetails)
      .set("Cookie", cookies[0]);

    // Response status code check
    expect(response.statusCode).toBe(400);
  });

  /** Test for a non-existent buyer profile. */
  it("should not be able to update a buyer profile for a user without a profile", async () => {
    // Prepare the request body
    const email = users[2].identification.email || "";
    const requestBody = prepareBuyerDetails(`Updated ${email}`, false);

    // Send the request
    const response: request.Response = await request(testApp)
      .patch("/api/buyers")
      .send(requestBody)
      .set("Cookie", cookies[2]);

    // Response status code check
    expect(response.statusCode).toBe(401);
  });
});

/** Tests for the toggle saved vendor route. */
describe("PATCH /api/buyers/savedVendor", () => {
  /** Test for successful addition of a saved vendor. */
  it("should be able to add a saved vendor successfully", async () => {
    // Prepare the request body, where buyer 1 will save vendor 2
    const buyerId = buyers[0]._id;
    const vendorId = vendors[1]._id;
    const vendorName = vendors[1].vendorName;
    const requestBody = { vendorId: vendorId.toString() };

    // Send the request
    const response: request.Response = await request(testApp)
      .patch("/api/buyers/savedVendor")
      .send(requestBody)
      .set("Cookie", cookies[0]);

    // Response status code check
    expect(response.statusCode).toBe(200);

    // Response body check (ie check the correct vendor was returned)
    const expectedVendor = { ...prepareVendorDetails(vendorName, false), _id: vendorId };
    const returnedVendors = JSON.parse(response.text);
    expect(returnedVendors.length).toBe(1);

    const returnedVendor = returnedVendors[0];
    compareExisting(returnedVendor, expectedVendor);

    // Check that the vendor was added to the buyer's saved vendors
    const actualBuyer = await BuyerModel.findById(buyerId).select("savedVendors");
    if (!actualBuyer) fail("The buyer was not found.");
    if (actualBuyer.savedVendors.length === 0) fail("The vendor was not added.");

    const savedVendorId = actualBuyer.savedVendors[0];
    expect(savedVendorId.equals(returnedVendor._id)).toBe(true);
  });

  /** Test for successful removal of a saved vendor. */
  it("should be able to remove a saved vendor successfully", async () => {
    // Prepare the request body, where buyer 1 will save vendor 2
    const buyerId = buyers[0]._id;
    const vendorId = vendors[1]._id;
    const requestBody = { vendorId: vendorId.toString() };

    // Send the request
    const response: request.Response = await request(testApp)
      .patch("/api/buyers/savedVendor")
      .send(requestBody)
      .set("Cookie", cookies[0]);

    // Response status code check
    expect(response.statusCode).toBe(200);

    // Response body check (ie check the response body is empty array)
    const returnedVendors = JSON.parse(response.text);
    expect(returnedVendors.length).toBe(0);

    // Check that the vendor was removed to the buyer's saved vendors
    const actualBuyer = await BuyerModel.findById(buyerId).select("savedVendors");
    if (!actualBuyer) fail("The buyer was not found.");
    if (actualBuyer.savedVendors.length !== 0) fail("The vendor was not removed.");
  });

  /** Test for missing authentication. */
  it("should not be able to toggle a saved vendor with missing authentication", async () => {
    // Prepare the request body, where buyer 1 will save vendor 2
    const vendorId = vendors[1]._id;
    const requestBody = { vendorId: vendorId.toString() };

    // Send the request
    const response: request.Response = await request(testApp)
      .patch("/api/buyers/savedVendor")
      .send(requestBody);

    // Response status code check
    expect(response.statusCode).toBe(401);
  });

  /** Test for an invalid vendor object id. */
  it("should not be able to toggle a saved vendor with an invalid object id", async () => {
    // Prepare the request body with an invalid object id
    const requestBody = { vendorId: "invalidVendorId" };

    // Send the request
    const response: request.Response = await request(testApp)
      .patch("/api/buyers/savedVendor")
      .send(requestBody)
      .set("Cookie", cookies[0]);

    // Response status code check
    expect(response.statusCode).toBe(422);
  });

  /** Test for a non-existent vendor. */
  it("should not be able to toggle a saved vendor for a non-existent vendor", async () => {
    // Prepare the request body with a non-existent vendor
    const randomVendorId = users[0]._id;
    const requestBody = { vendorId: randomVendorId.toString() };

    // Send the request
    const response: request.Response = await request(testApp)
      .patch("/api/buyers/savedVendor")
      .send(requestBody)
      .set("Cookie", cookies[0]);

    // Response status code check
    expect(response.statusCode).toBe(404);
  });
});

/** Tests for the get saved vendors route. */
describe("GET /api/buyers/savedVendors", () => {
  /** Test for successful retrieval of saved vendors. */
  it("should be able to retrieve saved vendors successfully", async () => {
    // Send the request
    const getResponse: request.Response = await request(testApp)
      .get("/api/buyers/savedVendors")
      .set("Cookie", cookies[0]);

    // Response status code check
    expect(getResponse.statusCode).toBe(200);

    // Response body check (ie check the correct vendor was returned)
    const returnedVendors = JSON.parse(getResponse.text);
    expect(returnedVendors.length).toBe(0);
  });

  /** Test for missing authentication. */
  it("should not be able to retrieve saved vendors with missing authentication", async () => {
    // Send the request
    const response: request.Response = await request(testApp).get("/api/buyers/savedVendors");

    // Response status code check
    expect(response.statusCode).toBe(401);
  });
});
