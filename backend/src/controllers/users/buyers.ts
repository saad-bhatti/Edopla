import { RequestHandler } from "express";
import mongoose from "mongoose";
import * as Http_Errors from "../../errors/http_errors";
import BuyerModel from "../../models/users/buyer";
import UserModel from "../../models/users/user";
import VendorModel from "../../models/users/vendor";
import { assertIsDefined } from "../../util/assertIsDefined";

/** "Type" of the HTTP request body when creating/modifying a buyer profile. */
interface BuyerBody {
  buyerName?: string;
  address?: string;
  phoneNumber?: string;
}

/** "Type" of the HTTP request body when updating a buyer's saved vendors list. */
interface SavedVendorBody {
  vendorId: string;
}

/**
 * Retrieve a buyer's profile from the database.
 *  - Prerequisite: Buyer's id must exist in session.
 *  - Params: None
 *  - Body: None
 *  - Return: Buyer
 */
export const getBuyer: RequestHandler<unknown, unknown, unknown, unknown> = async (
  req,
  res,
  next
) => {
  try {
    assertIsDefined(req.session.buyerId);
    const buyer = await BuyerModel.findById(req.session.buyerId).exec();
    if (!buyer) throw new Http_Errors.NotFound("Buyer profile");

    res.status(200).json(buyer);
  } catch (error) {
    next(error);
  }
};

/**
 * Add a new buyer profile to the database and update the user's profile.
 *  - Prerequisites:
 *    - User's id must exist in session.
 *    - User must not already have a buyer profile.
 *  - Params: None
 *  - Body: buyerName, address, phoneNumber
 *  - Return: Buyer
 */
export const createBuyer: RequestHandler<unknown, unknown, BuyerBody, unknown> = async (
  req,
  res,
  next
) => {
  const buyerName = req.body.buyerName;
  const address = req.body.address;
  const phoneNumber = req.body.phoneNumber;
  try {
    // Validate the existance of the required fields
    if (!buyerName || !address) throw new Http_Errors.MissingField();

    // Verify the validity of the user with no pre-existing buyer's profile
    assertIsDefined(req.session.userId);
    const user = await UserModel.findById(req.session.userId).exec();
    if (!user) throw new Http_Errors.NotFound("User");
    if (user._buyer) throw new Http_Errors.AlreadyExists("User's buyer profile");

    // Send the request to create the new buyer profile
    const newBuyer = await BuyerModel.create({
      buyerName: buyerName,
      address: address,
      phoneNumber: phoneNumber,
      savedVendors: [],
      carts: [],
      orders: [],
    });

    // Update & save the user's profile
    user._buyer = newBuyer._id;
    await user.save();

    // Add the buyer's id to the session
    req.session.buyerId = newBuyer._id;

    res.status(201).json(newBuyer);
  } catch (error) {
    next(error);
  }
};

/**
 * Update an existing buyer's profile.
 *  - Prerequisite: Buyer's id must exist in session.
 *  - Params: None
 *  - Body: buyerName, address, phoneNumber
 *  - Return: Buyer
 */
export const updateBuyer: RequestHandler<unknown, unknown, BuyerBody, unknown> = async (
  req,
  res,
  next
) => {
  const buyerName = req.body.buyerName;
  const address = req.body.address;
  const phoneNumber = req.body.phoneNumber;
  try {
    // Validate the existance of the required fields
    if (!buyerName || !address) throw new Http_Errors.MissingField();

    // Retrieve the existing buyer's profile
    assertIsDefined(req.session.buyerId);
    const buyer = await BuyerModel.findById(req.session.buyerId).exec();
    if (!buyer) throw new Http_Errors.NotFound("Buyer profile");

    // Update & save the buyer profile
    (buyer.buyerName = buyerName), (buyer.address = address), (buyer.phoneNumber = phoneNumber);
    const updatedBuyer = await buyer.save();

    res.status(200).json(updatedBuyer);
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieve a buyer's list of saved vendors.
 *  - Prerequisite: Buyer's id must exist in session.
 *  - Params: None
 *  - Body: None
 *  - Return: [Vendor]
 */
export const getSavedVendors: RequestHandler<unknown, unknown, unknown, unknown> = async (
  req,
  res,
  next
) => {
  try {
    // Retrieve the existing buyer's profile
    assertIsDefined(req.session.buyerId);
    const buyer = await BuyerModel.findById(req.session.buyerId).populate("savedVendors").exec();
    if (!buyer) throw new Http_Errors.NotFound("Buyer profile");

    res.status(200).json(buyer.savedVendors);
  } catch (error) {
    next(error);
  }
};

/**
 * Add the provided vendor's id to the buyer's list of saved vendors if it doesn't already exist in
 * the list. Otherwise remove it.
 *  - Prerequisite: Buyer's id must exist in session.
 *  - Params: None
 *  - Body: vendorId
 *  - Return: [Vendor]
 */
export const toggleSavedVendor: RequestHandler<unknown, unknown, SavedVendorBody, unknown> = async (
  req,
  res,
  next
) => {
  try {
    const unverifiedVendorId = req.body.vendorId;
    // Verify the existance of the vendor id
    if (!mongoose.isValidObjectId(unverifiedVendorId))
      throw new Http_Errors.InvalidField("vendor id");

    // Retrieve the existing vendor's profile
    const verifiedVendor = await VendorModel.findById(unverifiedVendorId).exec();
    if (!verifiedVendor) throw new Http_Errors.NotFound("Vendor");

    // Retrieve the existing buyer's profile
    assertIsDefined(req.session.buyerId);
    const buyer = await BuyerModel.findById(req.session.buyerId).select("savedVendors").exec();
    if (!buyer) throw new Http_Errors.NotFound("Buyer profile");

    // Update the buyer's saved vendors list
    const verifiedVendorId = verifiedVendor._id;
    const index = buyer.savedVendors.indexOf(verifiedVendorId);
    if (index === -1) buyer.savedVendors.push(verifiedVendorId);
    else buyer.savedVendors.splice(index, 1);

    // Save the updated buyer's profile & populate the saved vendors list
    const updatedBuyer = await buyer.save();
    await updatedBuyer.populate("savedVendors");

    res.status(200).json(updatedBuyer.savedVendors);
  } catch (error) {
    next(error);
  }
};
