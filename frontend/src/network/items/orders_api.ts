import { OrderItem } from "../../models/items/orderItem";
import { fetchData } from "../../utils/fetchData";

/** The initial segment of the endpoints. */
const buyerEndpoint = "/api/orders/buyer";
const vendorEndpoint = "/api/orders/vendor";

/** Interface for the input to create an order item. */
export interface OrderItemDetails {
  cartId: string;
}

/** Interface for the input to process an order item. */
export interface ProcessOrderDetails {
  isAccept: boolean;
}

/** Interface for the input to update the status of an order item. */
export interface UpdateOrderStatusDetails {
  status: number;
}

/**
 * Function to retrieve the orders of the currently authenticated buyer.
 * @param None
 * @returns A promise that resolves to an array of the buyer's order item objects.
 */
export async function getBuyerOrders(): Promise<OrderItem[]> {
  const response = await fetchData(`${buyerEndpoint}/`, {
    method: "GET",
  });
  return response.json();
}

/**
 * Function to retrieve the specified order of the currently authenticated buyer.
 * @param orderId the order's ID.
 * @returns A promise that resolves to the buyer's order item object.
 */
export async function getBuyerOrder(orderId: string): Promise<OrderItem> {
  const response = await fetchData(`${buyerEndpoint}/${orderId}`, {
    method: "GET",
  });
  return response.json();
}

/**
 * Function to place an order for the currently authenticated buyer.
 * @param details the cart ID.
 * @returns A promise that resolves to the new order item object.
 */
export async function placeOrder(details: OrderItemDetails): Promise<OrderItem> {
  const response = await fetchData(`${buyerEndpoint}/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(details),
  });
  return response.json();
}

/**
 * Function to cancel an order belonging to the currently authenticated buyer.
 * @param orderId the order ID.
 * @returns None
 */
export async function cancelOrder(orderId: string): Promise<void> {
  const response = await fetchData(`${buyerEndpoint}/${orderId}/cancel`, {
    method: "PATCH",
  });
  return response.json();
}

/**
 * Function to retrieve the orders of the currently authenticated vendor.
 * @param None
 * @returns A promise that resolves to an array of the vendor's order item objects.
 */
export async function getVendorOrders(): Promise<OrderItem[]> {
  const response = await fetchData(`${vendorEndpoint}/`, {
    method: "GET",
  });
  return response.json();
}

/**
 * Function to retrieve the specified order of the currently authenticated vendor.
 * @param orderId the order's ID.
 * @returns A promise that resolves to the vendor's order item object.
 */
export async function getVendorOrder(orderId: string): Promise<OrderItem> {
  const response = await fetchData(`${vendorEndpoint}/${orderId}`, {
    method: "GET",
  });
  return response.json();
}

/**
 * Function to process an order for the currently authenticated vendor.
 * @param orderId the order ID.
 * @param details the isAccept boolean.
 * @returns None
 */
export async function processOrder(orderId: string, details: ProcessOrderDetails): Promise<void> {
  await fetchData(`${vendorEndpoint}/${orderId}/process`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(details),
  });
}

/**
 * Function to update the order status of an order belonging the currently authenticated vendor.
 * @param orderId the order ID.
 * @param details the status number.
 * @returns A promise that resolves to the updated order item object.
 */
export async function updateOrderStatus(
  orderId: string,
  details: UpdateOrderStatusDetails
): Promise<OrderItem> {
  const response = await fetchData(`${vendorEndpoint}/${orderId}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(details),
  });
  return response.json();
}
