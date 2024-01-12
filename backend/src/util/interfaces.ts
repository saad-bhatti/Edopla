import { ObjectId } from "mongoose";

/** An interface for the identification attribute of a user */
export interface Identification {
  email?: string;
  googleId?: string;
  gitHubId?: string;
}

/** Interface for a user object in the database. */
export interface User {
  _id: ObjectId;
  identification: Identification;
  thirdParty: boolean;
  password?: string;
  _buyer: null | ObjectId | Buyer;
  _vendor: null | ObjectId | Vendor;
}

/** Interface for a buyer object in the database. */
export interface Buyer {
  _id: ObjectId;
  buyerName: string;
  address: string;
  phoneNumber?: string;
  carts: ObjectId[] | CartItem[];
  savedVendors: ObjectId[];
  orders: ObjectId[] | OrderItem[];
}

/** Interface for a vendor object in the database. */
export interface Vendor {
  _id: ObjectId;
  vendorName: string;
  address: string;
  priceRange: PriceRange;
  phoneNumber?: string;
  description?: string;
  cuisineTypes: string[];
  orders: ObjectId[] | OrderItem[];
  menu: ObjectId[] | MenuItem[];
}

/** Interface for a menu item in the database. */
export interface MenuItem {
  _id: ObjectId;
  name: string;
  price: number;
  available: boolean;
  category: string;
  description?: string;
  expireAt?: Date;
}

/** Interface for a cart item in the database. */
export interface CartItem {
  _id: ObjectId;
  vendorId: ObjectId;
  items: { item: ObjectId | MenuItem; quantity: number }[];
  savedForLater: boolean;
}

/** Interface for a order item in the database. */
export interface OrderItem {
  _id: ObjectId;
  buyerId: ObjectId;
  cartId: ObjectId | CartItem;
  totalPrice: number;
  date: Date;
  status: number;
}
