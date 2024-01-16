import bcrypt from "bcrypt";
import express, { RequestHandler } from "express";
import BuyerModel from "../../models/users/buyer";
import UserModel from "../../models/users/user";
import VendorModel from "../../models/users/vendor";
import { prepareBuyerDetails, prepareVendorDetails } from "./usersHelper";

export const testEmails = ["jest01@test.com", "jest02@test.com", "jest03@test.com"];

/**
 * Initializes documents into the profile-related collections in the test database.
 * Creates the following:
 * - User profiles: Three users with emails jest0X@test.com with passwords test123.
 * - Buyer profiles: One buyer profile for jest02@test.com.
 * - Vendor profiles: One vendor profile for jest03@test.com.
 * 
 * User 01: No buyer or vendor profile  - used for user tests
 * User 02: Buyer profile               - used for buyer tests
 * User 03: Vendor profile              - used for vendor tests
 * 
 *  - Params: None
 *  - Body: None
 *  - Return: None
 */
const initializeProfiles: RequestHandler<unknown, unknown, unknown, unknown> = async (
  req,
  res,
  next
) => {
  const users = []; // Stores the created users
  try {
    // Part 1: Create the user profiles
    const hashedPassword = await bcrypt.hash("test123", 10);
    for (const email of testEmails) {
      const user = new UserModel({
        identification: { email: email, googleId: null, gitHubId: null },
        password: hashedPassword,
        _buyer: null,
        _vendor: null,
      });
      const createdUser = await user.save();
      users.push(createdUser);
    }

    // Part 2: Create the buyer profiles & update the user profiles with the buyer profiles
    const buyerDetails = prepareBuyerDetails(testEmails[1], true);
    const buyer = new BuyerModel(buyerDetails);
    await buyer.save();
    users[1]._buyer = buyer._id;
    await users[1].save();

    // Part 3: Create the vendor profiles & update the user profiles with the vendor profiles
    const vendorDetails = prepareVendorDetails(testEmails[2], true);
    const vendor = new VendorModel(vendorDetails);
    await vendor.save();
    users[2]._vendor = vendor._id;
    await users[2].save();

    res.status(200).json({ message: "Databases successfully initialized" });
  } catch (error) {
    next(error);
  }
};

/**
 * Clears all the documents from the profile-related collections from the test database.
 *  - Params: None
 *  - Body: None
 *  - Return: None
 */
const clearProfiles: RequestHandler<unknown, unknown, unknown, unknown> = async (
  req,
  res,
  next
) => {
  try {
    await UserModel.deleteMany({}).exec();
    await BuyerModel.deleteMany({}).exec();
    await VendorModel.deleteMany({}).exec();

    res.status(200).json({ message: "Databases successfully cleared" });
  } catch (error) {
    next(error);
  }
};

/** Router for all database-related endpoints. */
const router = express.Router();

router.post("/initialize/profiles", initializeProfiles);
router.delete("/clear/profiles", clearProfiles);

export default router;
