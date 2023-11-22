import { Types } from "mongoose";

/** "Type" of the menu item in the database (no populated version possible). */
export interface MI {
  _id: Types.ObjectId;
  name: string;
  price: number;
  available: boolean;
  category: string;
  description?: string;
  expireAt?: Date;
}

/** "Type" of the unpopulated cart item in the database. */
export interface CI_U {
  _id: Types.ObjectId;
  vendorId: Types.ObjectId;
  items: Map<string, Types.ObjectId>;
  itemsQuantity: Map<string, number>;
  savedForLater: boolean;
}

/** "Type" of the cart item in the database with the items map populated. */
export interface CI_IP {
  _id: Types.ObjectId;
  vendorId: Types.ObjectId;
  items: Map<string, MI>;
  itemsQuantity: Map<string, number>;
  savedForLater: boolean;
}

/** "Type" of the unpopulated order item in the database. */
export interface OI_U {
  _id: Types.ObjectId;
  buyerId: Types.ObjectId;
  cartId: Types.ObjectId;
  totalPrice: number;
  date: Date;
  status: number;
}

/** "Type" of the order item in the database with the cart id populated. */
export interface OI_CP {
  _id: Types.ObjectId;
  buyerId: Types.ObjectId;
  cartId: CI_U;
  totalPrice: number;
  date: Date;
  status: number;
}

/** "Type" of the unpopulated buyer in the database. */
export interface B_U {
  _id: Types.ObjectId;
  buyerName: string;
  address: string;
  phoneNumber?: string;
  carts: Types.ObjectId[];
  savedVendors: Types.ObjectId[];
  orders: Types.ObjectId[];
}

/**
 * "Type" of the buyer profile in the database with the carts array populated
 * one level deep.
 */
export interface B_CP1 {
  _id: Types.ObjectId;
  buyerName: string;
  address: string;
  phoneNumber?: string;
  carts: CI_U[];
  savedVendors: Types.ObjectId[];
  orders: Types.ObjectId[];
}

/**
 * "Type" of the buyer profile in the database with the carts array populated
 * two levels deep.
 */
export interface B_CP2 {
  _id: Types.ObjectId;
  buyerName: string;
  address: string;
  phoneNumber?: string;
  carts: CI_IP[];
  savedVendors: Types.ObjectId[];
  orders: Types.ObjectId[];
}

/**
 * "Type" of the buyer profile in the database with the orders array populated
 * one level deep.
 */
export interface B_OP1 {
  _id: Types.ObjectId;
  buyerName: string;
  address: string;
  phoneNumber?: string;
  carts: Types.ObjectId[];
  savedVendors: Types.ObjectId[];
  orders: OI_U[];
}

/** "Type" of the unpopulated vendor in the database. */
export interface V_U {
  _id: Types.ObjectId;
  vendorName: string;
  address: string;
  phoneNumber?: string;
  orders: Types.ObjectId[];
  menu: Types.ObjectId[];
}

/**
 * "Type" of the vendor profile in the database with the orders array populated
 * one level deep.
 */
export interface V_OP1 {
  _id: Types.ObjectId;
  vendorName: string;
  address: string;
  phoneNumber?: string;
  orders: OI_U[];
}

/**
 * "Type" of the vendor profile in the database with the menus array populated
 * one level deep.
 */
export interface V_MP1 {
  _id: Types.ObjectId;
  vendorName: string;
  address: string;
  phoneNumber?: string;
  orders: Types.ObjectId[];
  menu: MI[];
}

/** "Type" of the user in the database. */
export interface U {
  _id: Types.ObjectId;
  email: string;
  password: string;
  _buyer?: Types.ObjectId;
  _vendor?: Types.ObjectId;
}