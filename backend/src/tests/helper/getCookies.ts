import request from "supertest";

/**
 * Function to get the authentication cookie for each user with the specified email.
 * @param emails The emails of the users to get the authentication cookie for.
 * @returns The authentication cookie for each user.
 */
export default async function getCookies(url: string, emails: string[]): Promise<string[]> {
  const cookieRetrievelPromises = emails.map(async (email) => {
    // Prepare the user details
    const requestBody = {
      isSignUp: false,
      email: email,
      password: "test123",
    };

    // Send the request
    const response: request.Response = await request(url)
      .post("/api/users/authenticate/form")
      .send(requestBody);

    // Get the authentication cookie
    const cookie = response.headers["set-cookie"];
    return cookie;
  });

  // Wait for all the cookie retrieval promises to resolve
  const cookies = await Promise.all(cookieRetrievelPromises);
  return cookies;
}
