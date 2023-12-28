import { Vendor } from "../users/vendor";
import { MenuItem } from "./menuItem";

/** "Type" for Cart Item object. */
export interface CartItem {
  _id: string;
  vendorId: Vendor;
  items: {item: MenuItem, quantity: number}[];
  savedForLater: boolean;
}
