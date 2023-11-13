/** "Type" for Order Item object. */
export interface OrderItem {
  _id: string;
  buyerId: string;
  cartId: string;
  totalPrice: number;
  date: string;
  status: number;
}