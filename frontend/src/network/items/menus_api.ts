/**************************************************************************************************
 * This file exports functions to make menu item related HTTP requests to the backend server.     *
 **************************************************************************************************/

import { MenuItem } from "../../models/items/menuItem";
import { fetchData } from "../../utils/fetchData";

/** The initial segment of the endpoints. */
const apiUrl = process.env.REACT_APP_API_URL;
const endpoint = `${apiUrl}/api/menus`;

/** Interface for the input to create or modify a menu item. */
export interface MenuItemDetails {
  name: string;
  price: number;
  category: string;
  description: string;
  availability: boolean;
}

/**
 * Function to retrieve the specified vendor's menu.
 * @param vendorId the vendor's ID.
 * @returns A promise that resolves to an array of the vendor's menu item objects.
 */
export async function getMenu(vendorId: string): Promise<MenuItem[]> {
  const response = await fetchData(`${endpoint}/${vendorId}`, {
    method: "GET",
  });
  return response.json();
}

/**
 * Function to retrieve the specified menu item.
 * @param menuItemId the menu item's ID.
 * @returns A promise that resolves to the menu item object.
 */
export async function getMenuItem(menuItemId: string): Promise<MenuItem> {
  const response = await fetchData(`${endpoint}/item/${menuItemId}`, {
    method: "GET",
  });
  return response.json();
}

/**
 * Function to create a menu item for the currently authenticated vendor.
 * @param details the menu item's name, price, category, and description.
 * @returns A promise that resolves to the new menu item object.
 */
export async function createMenuItem(details: MenuItemDetails): Promise<MenuItem> {
  const response = await fetchData(`${endpoint}/item`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(details),
  });
  return response.json();
}

/**
 * Function to update a menu item for the currently authenticated vendor.
 * @param menuItemId the menu item's ID.
 * @param details the updated menu item's name, price, category, and description.
 * @returns A promise that resolves to the updated menu item object.
 */
export async function updateMenuItem(
  menuItemId: string,
  details: MenuItemDetails
): Promise<MenuItem> {
  const response = await fetchData(`${endpoint}/item/${menuItemId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(details),
  });
  return response.json();
}

/**
 * Function to toggle 'availablity' of a menu item belonging to the currently authenticated vendor.
 * @param menuItemId the menu item's ID.
 * @returns A promise that resolves to the updated menu item object.
 */
export async function toggleAvailability(menuItemId: string): Promise<MenuItem> {
  const response = await fetchData(`${endpoint}/item/${menuItemId}`, {
    method: "PATCH",
  });
  return response.json();
}

/**
 * Function to delete a menu item belonging to the currently authenticated vendor.
 * @param None
 * @returns None
 */
export async function deleteMenuItem(menuItemId: string): Promise<void> {
  await fetchData(`${endpoint}/item/${menuItemId}`, {
    method: "DELETE",
  });
}
