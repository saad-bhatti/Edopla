import { InferSchemaType, model, Schema } from "mongoose";

// Define a schema for the 'Order' type
const orderItemSchema = new Schema({
  buyerId: { type: Schema.Types.ObjectId, ref: "Buyer", required: true },
  cartId: { type: Schema.Types.ObjectId, ref: "CartItem", required: true },
  totalPrice: { type: Number, required: true, minimum: 0 },
  date: { type: Date, required: true },
  status: {
    type: Number,
    required: true,
    minimum: 0,
    maximum: 4,
  },
});

// Create a 'Order' type from the schema
type OrderItem = InferSchemaType<typeof orderItemSchema>;

// Export the 'Order' collection
export default model<OrderItem>("OrderItem", orderItemSchema);
