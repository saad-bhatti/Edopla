import { RequestHandler } from "express";
import createHttpError from "http-errors";
import mongoose from "mongoose";
import BuyerModel from "../../models/users/buyer";
import UserModel from "../../models/users/user";
import VendorModel from "../../models/users/vendor";
import { assertIsDefined } from "../../util/assertIsDefined";

/** Retrieve a buyer's profile from the database. */
export const getBuyer: RequestHandler = async (req, res, next) => {
  try {
    assertIsDefined(req.session.buyerId);
    const buyer = await BuyerModel.findById(req.session.buyerId).exec();
    if (!buyer) throw createHttpError(404, "Buyer profile not found");

    res.status(200).json(buyer);
  } catch (error) {
    next(error);
  }
};

// "Type" of the HTTP request body when creating/modifying a buyer profile
interface BuyerBody {
  buyerName?: string;
  address?: string;
  phoneNumber?: string;
}

/** Add a new buyer profile to the database and update the user's profile. */
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
    if (!buyerName || !address) throw createHttpError(400, "A required field is missing");

    // Verify the validity of the user with no pre-existing buyer's profile
    assertIsDefined(req.session.userId);
    const user = await UserModel.findById(req.session.userId).exec();
    if (!user) throw createHttpError(404, "User not found");
    if (user._buyer) throw createHttpError(409, "User already has a buyer profile");

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

/** Update an existing buyer's profile. */
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
    if (!buyerName || !address) throw createHttpError(400, "A required field is missing");

    // Retrieve the existing buyer's profile
    assertIsDefined(req.session.buyerId);
    const buyer = await BuyerModel.findById(req.session.buyerId).exec();
    if (!buyer) throw createHttpError(404, "Buyer profile not found");

    // Update & save the buyer profile
    (buyer.buyerName = buyerName), (buyer.address = address), (buyer.phoneNumber = phoneNumber);
    const updatedBuyer = await buyer.save();

    res.status(200).json(updatedBuyer);
  } catch (error) {
    next(error);
  }
};

/** Get the buyer's list of saved vendors. */
export const getSavedVendors: RequestHandler = async (req, res, next) => {
  try {
    assertIsDefined(req.session.buyerId);
    const buyer = await BuyerModel.findById(req.session.buyerId).populate("savedVendors").exec();
    if (!buyer) throw createHttpError(404, "Buyer profile not found");

    res.status(200).json(buyer.savedVendors);
  } catch (error) {
    next(error);
  }
};

// "Type" of the HTTP request body when updating a buyer's saved vendors list
interface SavedVendorBody {
  vendorId: string;
}

/** If the provided vendor already exists in the saved vendor's list, the item
 * is removed from the list. Otherwise, the vendor is added to the list. */
export const updateSavedVendor: RequestHandler<unknown, unknown, SavedVendorBody, unknown> = async (
  req,
  res,
  next
) => {
  try {
    const unverifiedVendorId = req.body.vendorId;
    // Verify the existance of the vendor id
    if (!mongoose.isValidObjectId(unverifiedVendorId))
      throw createHttpError(400, "Invalid vendor id");
    const verifiedVendor = await VendorModel.findById(unverifiedVendorId).exec();
    if (!verifiedVendor) throw createHttpError(404, "Vendor id is not valid");

    // Retrieve the existing buyer's profile
    assertIsDefined(req.session.buyerId);
    const buyer = await BuyerModel.findById(req.session.buyerId).exec();
    if (!buyer) throw createHttpError(404, "Buyer profile not found");

    // Update & save the buyer profile
    const verifiedVendorId = verifiedVendor._id;
    const index = buyer.savedVendors.indexOf(verifiedVendorId);
    if (index === -1) buyer.savedVendors.push(verifiedVendorId);
    else buyer.savedVendors.splice(index, 1);
    const updatedBuyer = await buyer.save();

    res.status(200).json(updatedBuyer);
  } catch (error) {
    next(error);
  }
};
