/**************************************************************************************************
 * This file creates the interface for the Vendor object.                                         *
 **************************************************************************************************/

/** "Type" for Vendor object. */
export interface Vendor {
  _id: string;
  vendorName: string;
  address: string;
  priceRange: string;
  phoneNumber?: string;
  description?: string;
  cuisineTypes: string[];
  menu: string[];
  orders: string[];
}
