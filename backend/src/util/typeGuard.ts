import { ObjectId } from "mongoose";
import { CartItem, MenuItem, OrderItem } from "./interfaces";

/**
 * Function to check if an item is a MenuItem.
 * @param item - Item to check.
 * @returns True if item is a MenuItem, false otherwise.
 */
export function isMenuItem(item: ObjectId | MenuItem): item is MenuItem {
  return (item as MenuItem)._id !== undefined;
}

/**
 * Function to check if an item is a CartItem.
 * @param item - Item to check.
 * @returns True if item is a CartItem, false otherwise.
 */
export function isCartItem(item: ObjectId | CartItem): item is CartItem {
  return (item as CartItem)._id !== undefined;
}

/**
 * Function to check if an item is a OrderItem.
 * @param item - Item to check.
 * @returns True if item is a OrderItem, false otherwise.
 */
export function isOrderItem(item: ObjectId | OrderItem): item is OrderItem {
  return (item as OrderItem)._id !== undefined;
}
