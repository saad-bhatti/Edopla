import { InferSchemaType, model, Schema } from "mongoose";

// Define a schema for the 'Cart' type
const cartItemSchema = new Schema({
  vendorId: { type: Schema.Types.ObjectId, ref: "Vendor", required: true },
  items: {
    type: Map,
    of: Schema.Types.ObjectId,
    ref: "MenuItem",
  },
  itemsQuantity: {
    type: Map,
    of: Number,
  },
  savedForLater: { type: Boolean, required: true },
});

// Create a 'Cart' type from the schema
type CartItem = InferSchemaType<typeof cartItemSchema>;

// Export the 'Order' collection
export default model<CartItem>("Cart", cartItemSchema);
