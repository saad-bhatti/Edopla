import { InferSchemaType, model, Schema } from "mongoose";

// Define a schema for the 'menuItem' type
const menuItemSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  available: { type: Boolean, required: true },
  category: { type: String, required: true },
  description: { type: String },
  expireAt: { type: Date, select: false },
});

// Create a 'menuItem' type from the schema
type MenuItem = InferSchemaType<typeof menuItemSchema>;

// Export the 'menuItem' collection
export default model<MenuItem>("MenuItem", menuItemSchema);
