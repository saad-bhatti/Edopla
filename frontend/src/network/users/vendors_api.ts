/**************************************************************************************************
 * This file exports functions to make vendor profile related HTTP requests to the backend server.*
 **************************************************************************************************/

import { Vendor } from "../../models/users/vendor";
import { fetchData } from "../../utils/fetchData";

/** The initial segment of the endpoints. */
const apiUrl = process.env.REACT_APP_API_URL;
const endpoint = `${apiUrl}/api/vendors`;

/** Interface for the input to create or modify a buyer profile. */
export interface VendorDetails {
  vendorName: string;
  address: string;
  priceRange: string;
  phoneNumber?: string;
  description?: string;
}

/** Interface for the input to toggle a cuisine from the cuisine list. */
export interface CuisineDetails {
  cuisine: string;
}

/**
 * Function to retrieve the all the vendor profiles.
 * @param None
 * @returns A promise that resolves to all the vendor objects.
 */
export async function getAllVendors(): Promise<Vendor[]> {
  const response = await fetchData(`${endpoint}/all`, {
    method: "GET",
  });
  return response.json();
}

/**
 * Function to retrieve the currently authenticated user's vendor profile.
 * @param None
 * @returns A promise that resolves to the vendor object.
 */
export async function getVendor(): Promise<Vendor> {
  const response = await fetchData(`${endpoint}/`, {
    method: "GET",
  });
  return response.json();
}

/**
 * Function to create a vendor profile for the currently authenticated user.
 * @param details the vendor's name, address, priceRange, phoneNumber, and description.
 * @returns A promise that resolves to the new vendor object.
 */
export async function createVendor(details: VendorDetails): Promise<Vendor> {
  const response = await fetchData(`${endpoint}/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(details),
  });
  return response.json();
}

/**
 * Function to update a vendor profile for the currently authenticated user.
 * @param details the vendor's name, address, priceRange, phoneNumber, and description.
 * @returns A promise that resolves to the updated vendor object.
 */
export async function updateVendor(details: VendorDetails): Promise<Vendor> {
  const response = await fetchData(`${endpoint}/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(details),
  });
  return response.json();
}

/**
 * Function to add the provided cuisine to the currently authenticated user's cuisine list, if
 * it doesn't already exist in the list. Otherwise, the cuisine is removed.
 * @param details the vendor's id.
 * @returns A promise that resolves to the updated array of cuisine types.
 */
export async function toggleSavedVendor(cuisine: CuisineDetails): Promise<string[]> {
  const response = await fetchData(`${endpoint}/cuisine`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(cuisine),
  });
  return response.json();
}
