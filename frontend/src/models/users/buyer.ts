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