import { CartItem } from "../../models/items/cartItem";
import { fetchData } from "../../utils/fetchData";

/** The initial segment of the endpoints. */
const apiUrl = process.env.REACT_APP_API_URL;
const endpoint = `${apiUrl}/api/carts`;

/** Interface for the input to create a cart item. */
export interface CreateCartDetails {
  vendorId: string;
  items: string[];
  itemsQuantity: number[];
}

/** Interface for the input to update a cart item. */
export interface UpdateCartDetails {
  items: string[];
  itemsQuantity: number[];
}

/**
 * Function to retrieve the carts of the currently authenticated buyer.
 * @param None
 * @returns A promise that resolves to an array of the buyer's cart item objects.
 */
export async function getCarts(): Promise<CartItem[]> {
  const response = await fetchData(`${endpoint}/`, {
    method: "GET",
  });
  return response.json();
}

/**
 * Function to retrieve the specified cart of the currently authenticated buyer.
 * @param cartId the cart's ID.
 * @returns A promise that resolves to the buyer's cart item object.
 */
export async function getCart(cartId: string): Promise<CartItem> {
  const response = await fetchData(`${endpoint}/${cartId}`, {
    method: "GET",
  });
  return response.json();
}

/**
 * Function to create a cart item for the currently authenticated buyer.
 * @param details the vendor ID, items, and items quantity.
 * @returns A promise that resolves to the new cart item object.
 */
export async function createCart(details: CreateCartDetails): Promise<CartItem> {
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
 * Function to update a cart item belonging to the currently authenticated buyer.
 * @param cartId the cart's ID.
 * @param details items, and items quantity.
 * @returns A promise that resolves to the updated cart item object.
 */
export async function updateCart(cartId: string, details: UpdateCartDetails): Promise<CartItem> {
  const response = await fetchData(`${endpoint}/${cartId}/items`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(details),
  });
  return response.json();
}

/**
 * Function to toggle `saveForLater` of cart item belonging to the currently authenticated buyer.
 * @param cartId the cart's ID.
 * @returns A promise that resolves to the updated cart item object.
 */
export async function toggleSaveForLater(cartId: string): Promise<CartItem> {
  const response = await fetchData(`${endpoint}/${cartId}/savedForLater`, {
    method: "PATCH",
  });
  return response.json();
}

/**
 * Function to empty all carts of the currently authenticated buyer.
 * @param None
 * @returns None
 */
export async function emptyCarts(): Promise<void> {
  await fetchData(`${endpoint}/`, {
    method: "DELETE",
  });
}

/**
 * Function to empty the specified cart item of the currently authenticated buyer.
 * @param cartId the cart's ID.
 * @returns None
 */
export async function emptyCart(cartId: string): Promise<void> {
  await fetchData(`${endpoint}/${cartId}`, {
    method: "DELETE",
  });
}
