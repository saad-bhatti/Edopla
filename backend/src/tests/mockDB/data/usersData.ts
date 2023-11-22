import bcrypt from "bcrypt";
import mongoose from "mongoose";
import BuyerModel from "../../../models/users/buyer";
import UserModel from "../../../models/users/user";
import VendorModel from "../../../models/users/vendor";
import * as Interfaces from "../../../util/interfaces";

/**
 * Function to add users to the database, with the specified emails.
 * @param emails The emails of the users to add.
 * @returns A promise that resolves to the users that were added.
 */
export const addUsers = async (emails: string[]): Promise<Interfaces.U[]> => {
  try {
    // Hash the password
    const hashPassword = await bcrypt.hash("test123", 10);

    // Create the users in the database
    const userCreationPromises = emails.map(async (email) => {
      const user = await UserModel.create({
        _id: new mongoose.Types.ObjectId(),
        email: email,
        password: hashPassword,
      });
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
export const addBuyers = async (users: Interfaces.U[]): Promise<Interfaces.B_U[]> => {
  try {
    const buyerCreationPromises = users.map(async (user) => {
      // Create the buyers in the database
      const buyer = await BuyerModel.create({
        _id: new mongoose.Types.ObjectId(),
        buyerName: user.email,
        address: "123 Main Street",
        phoneNumber: "1234567890",
        carts: [],
        savedVendors: [],
        orders: [],
      });

      // Add the buyer profile to the user
      await UserModel.findByIdAndUpdate(user._id, { _buyer: buyer._id });

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
export const addVendors = async (users: Interfaces.U[]): Promise<Interfaces.V_U[]> => {
  try {
    const vendorCreationPromises = users.map(async (user) => {
      // Create the vendors in the database
      const vendor = await VendorModel.create({
        _id: new mongoose.Types.ObjectId(),
        vendorName: user.email,
        address: "123 Main Street",
        priceRange: "$$",
        phoneNumber: "1234567890",
        description: `This is ${user.email}'s vendor description.}`,
        cuisineTypes: [],
        menu: [],
        orders: [],
      });

      // Add the vendor profile to the user
      await UserModel.findByIdAndUpdate(user._id, { _vendor: vendor._id });

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