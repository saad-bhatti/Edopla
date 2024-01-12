import { InferSchemaType, model, Schema } from "mongoose";
import { Identification } from "../../util/interfaces";

// Define a schema for the 'User' type
const identificationSchema = new Schema<Identification>(
  {
    email: { type: String },
    googleId: { type: String },
    gitHubId: { type: String },
  },
  { _id: false }
);

// Define a schema for the 'User' type
const userSchema = new Schema({
  identification: {
    type: identificationSchema,
    // Ensure that at least one of the identification methods is provided
    validate: {
      validator: function (value: Identification) {
        return value.email || value.googleId || value.gitHubId;
      },
      message: "At least one identification method is required",
    },
    required: true,
  },
  password: { type: String, select: false },
  _buyer: { type: Schema.Types.ObjectId, ref: "Buyer" },
  _vendor: { type: Schema.Types.ObjectId, ref: "Vendor" },
});

// Create a 'User' type from the schema
type User = InferSchemaType<typeof userSchema>;

// Export the 'User' collection
export default model<User>("User", userSchema);
