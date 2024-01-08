import bcrypt from "bcrypt";
import mongoose from "mongoose";
import BuyerModel from "../../models/users/buyer";
import UserModel from "../../models/users/user";
import VendorModel from "../../models/users/vendor";
import * as Interfaces from "../../util/interfaces";
import {
  prepareUserDetails,
  prepareBuyerDetails,
  prepareVendorDetails,
} from "../helper/usersHelper";

/**
 * Function to add users to the database, with the specified emails.
 * @param emails The emails of the users to add.
 * @returns A promise that resolves to the users that were added.
 */
export const addUsers = async (emails: string[]): Promise<Interfaces.User[]> => {
  try {
    // Hash the password
    const hashPassword = await bcrypt.hash("test123", 10);

    // Create the users in the database
    const userCreationPromises = emails.map(async (email) => {
      // Prepare the user details with all details for creation
      const preparedDetails = prepareUserDetails(email);
      preparedDetails.password = hashPassword;
      const userDetails = { ...preparedDetails, _id: new mongoose.Types.ObjectId() };

      // Create the user in the database
      const userDoc = await UserModel.create(userDetails);

      // Convert the user document to a user object
      const user: Interfaces.User = userDoc.toObject() as Interfaces.User;
      return user;
    });

    // Wait for all the users to be created
    const users = await Promise.all(userCreationPromises);
    return users;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

/**
 * Function to add buyers to the database, for the specified users.
 * @param users The users whose buyer profiles will be created.
 * @returns A promise that resolves to the buyers that were added.
 */
export const addBuyers = async (users: Interfaces.User[]): Promise<Interfaces.Buyer[]> => {
  try {
    const buyerCreationPromises = users.map(async (user) => {
      // Prepare the buyer details with all details for creation
      const preparedDetails = prepareBuyerDetails(user.email, true);
      const buyerDetails = { ...preparedDetails, _id: new mongoose.Types.ObjectId() };

      // Create the buyers in the database
      const buyerDoc = await BuyerModel.create(buyerDetails);

      // Add the buyer profile to the user
      await UserModel.findByIdAndUpdate(user._id, { _buyer: buyerDoc._id });

      // Convert the buyer document to a buyer object
      const buyer: Interfaces.Buyer = buyerDoc.toObject() as Interfaces.Buyer;
      return buyer;
    });

    // Wait for all the buyers to be created
    const buyers = await Promise.all(buyerCreationPromises);
    return buyers;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

/**
 * Function to add vendors to the database, for the specified users.
 * @param users The users whose vendor profiles will be created.
 * @returns A promise that resolves to the vendors that were added.
 */
export const addVendors = async (users: Interfaces.User[]): Promise<Interfaces.Vendor[]> => {
  try {
    const vendorCreationPromises = users.map(async (user) => {
      // Prepare the vendor details with all details for creation
      const preparedDetails = prepareVendorDetails(user.email, true);
      const vendorDetails = { ...preparedDetails, _id: new mongoose.Types.ObjectId() };

      // Create the vendors in the database
      const vendorDoc = await VendorModel.create(vendorDetails);

      // Add the vendor profile to the user
      await UserModel.findByIdAndUpdate(user._id, { _vendor: vendorDoc._id });

      // Convert the user document to a user object
      const vendor: Interfaces.Vendor = vendorDoc.toObject() as Interfaces.Vendor;
      return vendor;
    });

    // Wait for all the vendors to be created
    const vendors = await Promise.all(vendorCreationPromises);
    return vendors;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
