/***********************************************************************
 * Note: All tests in this file depend on the success of user.test.ts. *
 ***********************************************************************/

import request from "supertest";
import { isUser } from "../../util/typeGuard";
import { testEmails } from "../helper/databaseRequests";
import getCookies from "../helper/getCookies";
import { compareExisting, prepareBuyerDetails, testNew } from "../helper/usersHelper";

const url = "http://localhost:5001";
let cookies: string[];

/** Initialize the database before all tests and retrieve the initialized user's cookies. */
beforeAll(async () => {
  const response: request.Response = await request(url).post("/api/database/initialize/profiles");
  console.log(response.text);

  cookies = await getCookies(url, testEmails);
  console.log({ message: "Cookies successfully retrieved" });
});

/** Clear the database after all tests. */
afterAll(async () => {
  const response: request.Response = await request(url).delete("/api/database/clear/profiles");
  console.log(response.text);
});

/** Tests for the getBuyer route. */
describe("GET /api/buyers", () => {
  /** Test for successful retrieval of a buyer profile. */
  it("should be able to retrieve a buyer profile successfully", async () => {
    // Prepare the buyer details without selected details for testing
    const expectedBuyer = prepareBuyerDetails(testEmails[1], false);

    // Send the request
    const response: request.Response = await request(url)
      .get("/api/buyers")
      .set("Cookie", cookies[1]);

    // Response status code check
    expect(response.statusCode).toBe(200);

    // Response body check
    const actualBuyer = JSON.parse(response.text);
    compareExisting(actualBuyer, expectedBuyer);
  });

  /** Test for a user without a buyer profile. */
  it("should not be able to retrieve a buyer profile successfully due to no profile", async () => {
    // Send the request
    const response: request.Response = await request(url)
      .get("/api/buyers")
      .set("Cookie", cookies[0]);

    // Response status code check
    expect(response.statusCode).toBe(401);
  });

  /** Test for a retrieval with missing authentication. */
  it("should not be able to retrieve a buyer profile with missing authentication", async () => {
    // Send the request
    const response: request.Response = await request(url).get("/api/buyers");

    // Response status code check
    expect(response.statusCode).toBe(401);
  });
});

/** Tests for the create buyer profile route. */
describe("POST /api/buyers/", () => {
  /** Test for successful creation of a buyer profile. */
  it("should be able to create a buyer profile successfully", async () => {
    // Prepare the buyer details without selected details for creation
    const requestBody = prepareBuyerDetails(testEmails[0], false);

    // Send the request
    const buyerResponse: request.Response = await request(url)
      .post("/api/buyers")
      .send(requestBody)
      .set("Cookie", cookies[2]);

    // Response status code check
    expect(buyerResponse.statusCode).toBe(201);

    // Response body check
    const actualBuyer = JSON.parse(buyerResponse.text);
    testNew(actualBuyer, requestBody);

    // Retrieve the user
    const userResponse: request.Response = await request(url)
      .get("/api/users/")
      .set("Cookie", cookies[2]);
    const actualUser = JSON.parse(userResponse.text);

    // Check that the buyer profile was added to the user
    if (!isUser(actualUser)) fail("The user was not found.");
    if (!actualUser._buyer) fail("The buyer profile was not added to the user.");
    expect(actualUser._buyer.toString()).toBe(actualBuyer._id.toString());
  });

  /** Test for missing authentication. */
  it("should not be able to create a buyer profile with missing authentication", async () => {
    // Prepare the buyer details without selected details for creation
    const requestBody = prepareBuyerDetails(testEmails[0], false);

    // Send the request
    const response: request.Response = await request(url).post("/api/buyers").send(requestBody);

    // Response status code check
    expect(response.statusCode).toBe(401);
  });

  /** Test for missing argument. */
  it("should not be able to create a buyer profile with a missing argument", async () => {
    // Prepare the buyer details without selected details for creation and without a buyer name
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { buyerName, ...missingBuyerDetails } = prepareBuyerDetails(testEmails[0], false);

    // Send the request
    const response: request.Response = await request(url)
      .post("/api/buyers")
      .send(missingBuyerDetails)
      .set("Cookie", cookies[0]);

    // Response status code check
    expect(response.statusCode).toBe(400);
  });

  /** Test for an existing buyer profile. */
  it("should not be able to create a buyer profile for a user with existing profile", async () => {
    // Prepare the buyer details without selected details for creation
    const requestBody = prepareBuyerDetails(testEmails[1], false);

    // Send the request
    const response: request.Response = await request(url)
      .post("/api/buyers")
      .send(requestBody)
      .set("Cookie", cookies[1]);

    // Response status code check
    expect(response.statusCode).toBe(409);
  });
});

/** Tests for the update buyer profile route. */
describe("PATCH /api/buyers/", () => {
  /** Test for successful update of a buyer profile. */
  it("should be able to update a buyer profile successfully", async () => {
    // Prepare the buyer details without selected details for modification & testing
    const requestBody = prepareBuyerDetails(`Updated ${testEmails[1]}`, false);

    // Send the request
    const response: request.Response = await request(url)
      .patch("/api/buyers")
      .send(requestBody)
      .set("Cookie", cookies[1]);

    // Response status code check
    expect(response.statusCode).toBe(200);

    // Response body check
    const responseBody = JSON.parse(response.text);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, ...actualBuyer } = responseBody;
    compareExisting(actualBuyer, requestBody);
  });

  /** Test for missing authentication. */
  it("should not be able to update a buyer profile with missing authentication", async () => {
    // Prepare the buyer details without selected details for modification
    const requestBody = prepareBuyerDetails(`Updated ${testEmails[1]}`, false);

    // Send the request
    const response: request.Response = await request(url).patch("/api/buyers").send(requestBody);

    // Response status code check
    expect(response.statusCode).toBe(401);
  });

  /** Test for missing argument. */
  it("should not be able to update a buyer profile with a missing argument", async () => {
    // Prepare the request body
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { buyerName, ...missingBuyerDetails } = prepareBuyerDetails(
      `Updated ${testEmails[1]}`,
      false
    );

    // Send the request
    const response: request.Response = await request(url)
      .patch("/api/buyers")
      .send(missingBuyerDetails)
      .set("Cookie", cookies[1]);

    // Response status code check
    expect(response.statusCode).toBe(400);
  });

  /** Test for a non-existent buyer profile. */
  it("should not be able to update a buyer profile for a user without a profile", async () => {
    // Prepare the request body
    const requestBody = prepareBuyerDetails(`Updated ${testEmails[0]}`, false);

    // Send the request
    const response: request.Response = await request(url)
      .patch("/api/buyers")
      .send(requestBody)
      .set("Cookie", cookies[0]);

    // Response status code check
    expect(response.statusCode).toBe(401);
  });
});
