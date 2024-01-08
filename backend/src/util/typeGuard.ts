import { ObjectId } from "mongoose";
import * as Interfaces from "./interfaces";

/**
 * Function to check if an item is an objectid.
 * @param item - Item to check.
 * @returns True if item is an objectid, false otherwise.
 */
export function isObjectId(item: ObjectId | Interfaces.MenuItem): item is ObjectId {
  return (item as ObjectId) !== undefined;
}

/**
 * Function to check if an item is a User object.
 * @param item - Item to check.
 * @returns True if item is a User, false otherwise.
 */
export function isUser(item: Interfaces.User | null): item is Interfaces.User {
  return (item as Interfaces.User)._id !== undefined;
}

/**
 * Function to check if an item is a Buyer object.
 * @param item - Item to check.
 * @returns True if item is a Buyer, false otherwise.
 */
export function isBuyer(item: Interfaces.Buyer | null): item is Interfaces.Buyer {
  return (item as Interfaces.Buyer)._id !== undefined;
}

/**
 * Function to check if an item is a Vendor object.
 * @param item - Item to check.
 * @returns True if item is a Vendor, false otherwise.
 */
export function isVendor(item: Interfaces.Vendor | null): item is Interfaces.Vendor {
  return (item as Interfaces.Vendor)._id !== undefined;
}

/**
 * Function to check if an item is a MenuItem.
 * @param item - Item to check.
 * @returns True if item is a MenuItem, false otherwise.
 */
export function isMenuItem(item: ObjectId | Interfaces.MenuItem): item is Interfaces.MenuItem {
  return (item as Interfaces.MenuItem)._id !== undefined;
}

/**
 * Function to check if an item is a CartItem.
 * @param item - Item to check.
 * @returns True if item is a CartItem, false otherwise.
 */
export function isCartItem(item: ObjectId | Interfaces.CartItem): item is Interfaces.CartItem {
  return (item as Interfaces.CartItem)._id !== undefined;
}

/**
 * Function to check if an item is a OrderItem.
 * @param item - Item to check.
 * @returns True if item is a OrderItem, false otherwise.
 */
export function isOrderItem(item: ObjectId | Interfaces.OrderItem): item is Interfaces.OrderItem {
  return (item as Interfaces.OrderItem)._id !== undefined;
}
