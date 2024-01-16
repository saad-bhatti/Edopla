/***********************************************************************
 * Note: All tests in this file depend on the success of user.test.ts. *
 ***********************************************************************/

import request from "supertest";
import { isUser } from "../../util/typeGuard";
import { testEmails } from "../helper/databaseRequests";
import getCookies from "../helper/getCookies";
import { compareExisting, prepareVendorDetails, testNew } from "../helper/usersHelper";

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

/** Tests for the getVendor route. */
describe("GET /api/vendors", () => {
  /** Test for successful retrieval of a vendor profile. */
  it("should be able to retrieve a vendor profile successfully", async () => {
    // Prepare the vendor details without selected details for testing
    const expectedVendor = prepareVendorDetails(testEmails[2], false);

    // Send the request
    const response: request.Response = await request(url)
      .get("/api/vendors")
      .set("Cookie", cookies[2]);

    // Response status code check
    expect(response.statusCode).toBe(200);

    // Response body check
    const actualVendor = JSON.parse(response.text);
    compareExisting(actualVendor, expectedVendor);
  });

  /** Test for a user without a vendor profile. */
  it("should not be able to retrieve a vendor profile successfully due to no profile", async () => {
    // Send the request
    const response: request.Response = await request(url)
      .get("/api/vendors")
      .set("Cookie", cookies[0]);

    // Response status code check
    expect(response.statusCode).toBe(401);
  });
});

/** Tests for the create vendor profile route. */
describe("POST /api/vendors/", () => {
  /** Test for successful creation of a vendor profile. */
  it("should be able to create a vendor profile successfully", async () => {
    // Prepare the vendor details without selected details for creation
    const requestBody = prepareVendorDetails(testEmails[1], false);

    // Send the request
    const vendorResponse: request.Response = await request(url)
      .post("/api/vendors")
      .send(requestBody)
      .set("Cookie", cookies[1]);

    // Response status code check
    expect(vendorResponse.statusCode).toBe(201);

    // Response body check
    const actualVendor = JSON.parse(vendorResponse.text);
    testNew(actualVendor, requestBody);

    // Retrieve the user
    const userResponse: request.Response = await request(url)
      .get("/api/users/")
      .set("Cookie", cookies[1]);
    const actualUser = JSON.parse(userResponse.text);

    // Check that the vendor profile was added to the user
    if (!isUser(actualUser)) fail("The user was not found.");
    if (!actualUser._vendor) fail("The vendor profile was not added to the user.");
    expect(actualUser._vendor.toString()).toBe(actualVendor._id.toString());
  });

  /** Test for missing authentication. */
  it("should not be able to create a vendor profile with missing authentication", async () => {
    // Prepare the vendor details without selected details for creation
    const requestBody = prepareVendorDetails(testEmails[0], false);

    // Send the request
    const response: request.Response = await request(url).post("/api/vendors").send(requestBody);

    // Response status code check
    expect(response.statusCode).toBe(401);
  });

  /** Test for missing argument. */
  it("should not be able to create a vendor profile with a missing argument", async () => {
    // Prepare the vendor details without selected details for creation and without a vendor name
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { vendorName, ...missingVendorDetails } = prepareVendorDetails(testEmails[0], false);

    // Send the request
    const response: request.Response = await request(url)
      .post("/api/vendors")
      .send(missingVendorDetails)
      .set("Cookie", cookies[0]);

    // Response status code check
    expect(response.statusCode).toBe(400);
  });

  /** Test for an existing vendor profile. */
  it("should not be able to create a vendor profile for a user with existing profile", async () => {
    // Prepare the buyer details without selected details for creation
    const requestBody = prepareVendorDetails(testEmails[2], false);

    // Send the request
    const response: request.Response = await request(url)
      .post("/api/vendors")
      .send(requestBody)
      .set("Cookie", cookies[2]);

    // Response status code check
    expect(response.statusCode).toBe(409);
  });
});

/** Tests for the update vendor profile route. */
describe("PATCH /api/vendors/", () => {
  /** Test for successful update of a vendor profile. */
  it("should be able to update a vendor profile successfully", async () => {
    // Prepare the vendor details without selected details for modification & testing
    const requestBody = prepareVendorDetails(`Updated ${testEmails[2]}`, false);

    // Send the request
    const response: request.Response = await request(url)
      .patch("/api/vendors")
      .send(requestBody)
      .set("Cookie", cookies[2]);

    // Response status code check
    expect(response.statusCode).toBe(200);

    // Response body check
    const responseBody = JSON.parse(response.text);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, ...actualVendor } = responseBody;
    compareExisting(actualVendor, requestBody);
  });

  /** Test for missing authentication. */
  it("should not be able to update a vendor profile with missing authentication", async () => {
    // Prepare the vendor details without selected details for modification
    const requestBody = prepareVendorDetails(`Updated ${testEmails[2]}`, false);

    // Send the request
    const response: request.Response = await request(url).patch("/api/vendors").send(requestBody);

    // Response status code check
    expect(response.statusCode).toBe(401);
  });

  /** Test for missing argument. */
  it("should not be able to update a vendor profile with a missing argument", async () => {
    // Prepare the request body
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { vendorName, ...missingVendorDetails } = prepareVendorDetails(
      `Updated ${testEmails[2]}`,
      false
    );

    // Send the request
    const response: request.Response = await request(url)
      .patch("/api/vendors")
      .send(missingVendorDetails)
      .set("Cookie", cookies[2]);

    // Response status code check
    expect(response.statusCode).toBe(400);
  });

  /** Test for a non-existent vendor profile. */
  it("should not be able to update a buyer profile for a user without a profile", async () => {
    // Prepare the request body
    const requestBody = prepareVendorDetails(`Updated ${testEmails[0]}`, false);

    // Send the request
    const response: request.Response = await request(url)
      .patch("/api/vendors")
      .send(requestBody)
      .set("Cookie", cookies[0]);

    // Response status code check
    expect(response.statusCode).toBe(401);
  });
});
