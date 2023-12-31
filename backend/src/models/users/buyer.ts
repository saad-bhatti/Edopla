import { InferSchemaType, model, Schema } from "mongoose";

// Define a schema for the 'Buyer' type
const buyerSchema = new Schema({
  buyerName: { type: String, required: true },
  address: { type: String, required: true },
  phoneNumber: { type: String },
  carts: { type: [Schema.Types.ObjectId], ref: "CartItem", required: true, select: false },
  savedVendors: { type: [Schema.Types.ObjectId], ref: "Vendor", required: true, select: false },
  orders: { type: [Schema.Types.ObjectId], ref: "OrderItem", required: true, select: false },
});

// Create a 'Buyer' type from the schema
type Buyer = InferSchemaType<typeof buyerSchema>;

// Export the 'Buyer' collection
export default model<Buyer>("Buyer", buyerSchema);
