/** "Type" for Cart Item object. */
export interface CartItem {
  _id: string;
  vendorId: string;
  items: Map<string, string>;
  itemsQuantity: Map<string, number>;
  savedForLater: boolean;
}