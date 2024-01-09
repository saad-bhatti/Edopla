import mongoose, { Document, Schema } from "mongoose";

interface CartItem {
  vendorId: mongoose.Types.ObjectId;
  savedForLater: boolean;
  items: { item: mongoose.Types.ObjectId; quantity: number }[];
}

interface CartItemDocument extends CartItem, Document {}

// Define a schema for the 'Cart' type
const itemSchema = new Schema(
  {
    item: { type: Schema.Types.ObjectId, ref: "MenuItem", required: true },
    quantity: { type: Number, required: true },
  },
  { _id: false }
);

const cartItemSchema = new Schema<CartItemDocument>({
  vendorId: { type: Schema.Types.ObjectId, ref: "Vendor", required: true },
  savedForLater: { type: Boolean, required: true },
  items: [itemSchema],
});

const CartItemModel = mongoose.model<CartItemDocument>("CartItem", cartItemSchema);

export default CartItemModel;
