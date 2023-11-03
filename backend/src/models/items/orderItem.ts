import { InferSchemaType, model, Schema } from "mongoose";

// Define a schema for the 'Order' type
const orderItemSchema = new Schema({
  buyerId: { type: Schema.Types.ObjectId, ref: "Buyer", required: true },
  cartId: { type: Schema.Types.ObjectId, ref: "Cart", required: true },
  totalPrice: { type: Number, required: true },
  date: { type: Date, required: true },
  status: {
    type: String,
    required: true,
    enum: ["pending", "in-progress", "ready", "completed", "cancelled"],
  },
});

// Create a 'Order' type from the schema
type OrderItem = InferSchemaType<typeof orderItemSchema>;

// Export the 'Order' collection
export default model<OrderItem>("Order", orderItemSchema);
