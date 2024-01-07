/**************************************************************************************************
 * This file creates the interface for the Buyer object.                                          *
 **************************************************************************************************/

/** "Type" for Buyer object. */
export interface Buyer {
  _id: string;
  buyerName: string;
  address: string;
  phoneNumber?: string;
  carts: string[];
  savedVendors: string[];
  orders: string[];
}
