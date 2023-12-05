import { Buyer } from "../../models/users/buyer";
import { Vendor } from "../../models/users/vendor";
import { fetchData } from "../../utils/fetchData";

/** The initial segment of the endpoints. */
const apiUrl = process.env.REACT_APP_API_URL;
const endpoint = `${apiUrl}/api/buyers`;

/** Interface for the input to create or modify a buyer profile. */
export interface BuyerDetails {
  buyerName: string;
  address: string;
  phoneNumber?: string;
}

/** Interface for the input to toggle a vendor from the saved vendors list. */
export interface SavedVendorDetails {
  vendorId: string;
}

/**
 * Function to retrieve the currently authenticated user's buyer profile.
 * @param None
 * @returns A promise that resolves to the buyer object.
 */
export async function getBuyer(): Promise<Buyer> {
  const response = await fetchData(`${endpoint}/`, {
    method: "GET",
  });
  return response.json();
}

/**
 * Function to create a buyer profile for the currently authenticated user.
 * @param details the buyer's name, address, and phone number.
 * @returns A promise that resolves to the new buyer object.
 */
export async function createBuyer(details: BuyerDetails): Promise<Buyer> {
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
 * Function to update a buyer profile for the currently authenticated user.
 * @param details the updated buyer's name, address, and phone number.
 * @returns A promise that resolves to the updated buyer object.
 */
export async function logIn(details: BuyerDetails): Promise<Buyer> {
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
 * Function to retrieve the currently authenticated user's saved vendors list.
 * @param None
 * @returns A promise that resolves to the array of saved vendor objects.
 */
export async function getSavedVendors(): Promise<Vendor[]> {
  const response = await fetchData(`${endpoint}/savedVendors`, {
    method: "GET",
  });
  return response.json();
}

/**
 * Function to add the provided vendor to the currently authenticated user's saved vendors list, if
 * it doesn't already exist in the list. Otherwise, the vendor is removed.
 * @param details the vendor's id.
 * @returns A promise that resolves to the updated array of saved vendor objects.
 */
export async function toggleSavedVendor(details: SavedVendorDetails): Promise<Vendor[]> {
  const errorOptions = new Map<number, string>().set(
    401,
    "Please sign up or log in to save a vendor."
  );

  const response = await fetchData(
    `${endpoint}/savedVendor`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(details),
    },
    errorOptions
  );
  return response.json();
}
