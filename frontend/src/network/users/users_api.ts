import { User } from "../../models/users/user";
import { fetchData } from "../../utils/fetchData";

/** The initial segment of the endpoints. */
const apiUrl = process.env.REACT_APP_API_URL;
const endpoint = `${apiUrl}/api/users`;

/** Interface for the input to sign up or login. */
export interface UserCredentials {
  email: string;
  password: string;
}

/**
 * Function to retrieve the currently logged in user.
 * @param None
 * @returns A promise that resolves to the currently logged in user object.
 */
export async function getLoggedInUser(): Promise<User> {
  const response = await fetchData(`${endpoint}/`, {
    method: "GET",
  });
  return response.json();
}

/**
 * Function to create a new user.
 * @param credentials the new user's email and password.
 * @returns A promise that resolves to the new user object.
 */
export async function signUp(credentials: UserCredentials): Promise<User> {
  const response = await fetchData(`${endpoint}/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });
  return response.json();
}

/**
 * Function to login in a user.
 * @param credentials the user's email and password.
 * @returns A promise that resolves to the user object.
 */
export async function logIn(credentials: UserCredentials): Promise<User> {
  const response = await fetchData(`${endpoint}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });
  return response.json();
}

/**
 * Function to logout an authenticated user.
 * @param None
 * @returns None
 */
export async function logout(): Promise<void> {
  await fetchData(`${endpoint}/logout`, {
    method: "POST",
  });
}
