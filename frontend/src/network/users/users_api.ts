/**************************************************************************************************
 * This file exports functions to make user profile related HTTP requests to the backend server.  *
 **************************************************************************************************/

import { User } from "../../models/users/user";
import { fetchData } from "../../utils/fetchData";

/** The initial segment of the endpoints. */
const apiUrl = process.env.REACT_APP_API_URL;
const endpoint = `${apiUrl}/api/users`;

/** Interface for the input to authenticate using a form. */
export interface FormCredentials {
  isSignUp: boolean;
  email: string;
  password: string;
}

/** Interface for the input to authenticate with a google JWT token. */
export interface GoogleCredentials {
  isSignUp: boolean;
  token: string;
}

/** Interface for the input to authenticate with a GitHub code. */
export interface GitHubCredentials {
  code: string;
}

/** Interface for the input to link an account. */
export interface LinkAuthenticationBody {
  identifier: string;
  email?: string;
  password?: string;
  token?: string;
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
 * Function to authenticate the client with a form.
 * @param credentials isSignUp: boolean, email: string, password: string
 * @returns A promise that resolves to the user object.
 */
export async function authenticateForm(credentials: FormCredentials): Promise<User> {
  const response = await fetchData(`${endpoint}/authenticate/form`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });
  return response.json();
}

/**
 * Function to authenticate the client with Google oauth.
 * @param credentials isSignUp: boolean, token: string
 * @returns A promise that resolves to the user object.
 */
export async function authenticateGoogle(credentials: GoogleCredentials): Promise<User> {
  const response = await fetchData(`${endpoint}/authenticate/google`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });
  return response.json();
}

/**
 * Function to authenticate the client with GitHub oauth.
 * @param credentials isSignUp: boolean, token: string
 * @returns A promise that resolves to the user object.
 */
export async function authenticateGitHub(credentials: GitHubCredentials): Promise<User> {
  const response = await fetchData(`${endpoint}/authenticate/github`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });
  return response.json();
}

/**
 * Function to link an account.
 * @param credentials identifier: "form" | "google" | "gitHub", email?: string, password?: string, token?: string
 * @returns A promise that resolves to the user object.
 */
export async function linkAuthentication(credentials: LinkAuthenticationBody): Promise<User> {
  const response = await fetchData(`${endpoint}/link`, {
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
