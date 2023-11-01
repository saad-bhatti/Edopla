import { User } from "../models/user";
import { fetchData } from "../utils/fetchData";

// Function to retrieve the currently login user
export async function getLoggedInUser(): Promise<User> {
  const response = await fetchData("/api/users", {
    method: "GET",
  });
  return response.json();
}

// Interface for the input to sign up a new user
export interface SignUpCredentials {
  username: string;
  email: string;
  password: string;
}

// Function to create a new user in the backend
export async function signUp(credentials: SignUpCredentials): Promise<User> {
  const response = await fetchData("/api/users/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });
  return response.json();
}

// Interface for the input to sign up a new user
export interface LogInCredentials {
  username: string;
  password: string;
}

// Function to login a user
export async function logIn(credentials: LogInCredentials): Promise<User> {
  const response = await fetchData("/api/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });
  return response.json();
}

// Function to logout an authenticated user
export async function logout(): Promise<void> {
  await fetchData("/api/users/logout", {
    method: "POST",
  });
}
