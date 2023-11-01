import { InferSchemaType, model, Schema } from "mongoose";

// Define a schema for the 'User' type
const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  _buyer: { type: Schema.Types.ObjectId, ref: "Buyer" },
  _vendor: { type: Schema.Types.ObjectId, ref: "Vendor" },
});

// Create a 'User' type from the schema
type User = InferSchemaType<typeof userSchema>;

// Export the 'User' collection
export default model<User>("User", userSchema);
