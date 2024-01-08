import request from "supertest";
import app from "../../app";

/**
 * Function to get the authentication cookie for each user with the specified email.
 * @param emails The emails of the users to get the authentication cookie for.
 * @returns The authentication cookie for each user.
 */
export default async function getCookies(emails: string[]): Promise<string[]> {
  const cookieRetrievelPromises = emails.map(async (email) => {
    // Send the request
    const response: request.Response = await request(app)
      .post("/api/users/login")
      .send({
        email: email,
        password: "test123",
      });

    // Get the authentication cookie
    const cookie = response.headers["set-cookie"];
    return cookie;
  });

  // Wait for all the cookie retrieval promises to resolve
  const cookies = await Promise.all(cookieRetrievelPromises);
  return cookies;
}