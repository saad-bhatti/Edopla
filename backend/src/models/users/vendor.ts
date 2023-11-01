import { InferSchemaType, model, Schema } from "mongoose";

// Define a schema for the 'Vendor' type
const vendorSchema = new Schema({
  vendorName: { type: String, required: true, unique: true },
  address: { type: String, required: true },
  priceRange: { type: String, required: true, enum: ["$", "$$", "$$$"] },
  phoneNumber: { type: String },
  description: { type: String },
  cuisineTypes: { type: [String] },
  menu: { type: [Schema.Types.ObjectId], ref: "MenuItem", required: true, select: false },
  orders: { type: [Schema.Types.ObjectId], ref: "Order", required: true, select: false },
});

// Create a 'VendorCredentials' type from the schema
type Vendor = InferSchemaType<typeof vendorSchema>;

// Export the 'VendorCredentials' collection
export default model<Vendor>("Vendor", vendorSchema);
