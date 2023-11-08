import { RequestHandler } from "express";
import * as Http_Errors from "../../errors/http_errors";
import UserModel from "../../models/users/user";
import VendorModel from "../../models/users/vendor";
import { assertIsDefined } from "../../util/assertIsDefined";
import { assertIsPriceRange } from "../../util/assertIsPriceRange";

/** "Type" of the HTTP request body when creating/modifying a vendor profile. */
interface ProfileBody {
  vendorName?: string;
  address?: string;
  priceRange?: string;
  phoneNumber?: string;
  description?: string;
}

/** "Type" of the HTTP request body when modifying a vendor's cuisine types. */
interface CuisineBody {
  cuisine: string;
}

/**
 * Retrieve a vendor's profile from the database.
 *  - Prerequisite: Vendor's id must exist in session.
 *  - Params: None
 *  - Body: None
 *  - Return: Vendor
 */
export const getVendor: RequestHandler<unknown, unknown, unknown, unknown> = async (
  req,
  res,
  next
) => {
  try {
    assertIsDefined(req.session.vendorId);
    const vendor = await VendorModel.findById(req.session.vendorId).exec();
    if (!vendor) throw new Http_Errors.NotFound("Vendor profile");

    res.status(200).json(vendor);
  } catch (error) {
    next(error);
  }
};

/**
 * Add a new vendor profile to the database and update the user's profile.
 *  - Prerequisites:
 *    - User's id must exist in session.
 *    - User must not already have a vendor profile.
 *  - Params: None
 *  - Body: vendorName, address, priceRange, phoneNumber, description
 *  - Return: Vendor
 */
export const createVendor: RequestHandler<unknown, unknown, ProfileBody, unknown> = async (
  req,
  res,
  next
) => {
  const vendorName = req.body.vendorName;
  const address = req.body.address;
  const priceRange = req.body.priceRange;
  const phoneNumber = req.body.phoneNumber;
  const description = req.body.description;
  try {
    // Verify the validity of the user with no pre-existing vendor's profile
    assertIsDefined(req.session.userId);
    const user = await UserModel.findById(req.session.userId).exec();
    if (!user) throw new Http_Errors.NotFound("User");
    if (user._vendor) throw new Http_Errors.AlreadyExists("User's vendor profile");

    // Validate the provided fields
    if (!vendorName || !address || !priceRange) throw new Http_Errors.MissingField();
    assertIsPriceRange(priceRange);

    // Send the request to create the new vendor profile
    const newVendor = await VendorModel.create({
      vendorName: vendorName,
      address: address,
      priceRange: priceRange,
      phoneNumber: phoneNumber,
      description: description,
      cuisineTypes: [],
      menuItems: [],
      orders: [],
    });

    // Update & save the user's profile
    user._vendor = newVendor._id;
    await user.save();

    // Add the vendor's id to the session
    req.session.vendorId = newVendor._id;

    res.status(201).json(newVendor);
  } catch (error) {
    next(error);
  }
};

/**
 * Update an existing vendor's profile.
 *  - Prerequisite: Vendor's id must exist in session.
 *  - Params: None
 *  - Body: vendorName, address, priceRange, phoneNumber, description
 *  - Return: Vendor
 */
export const updateVendor: RequestHandler<unknown, unknown, ProfileBody, unknown> = async (
  req,
  res,
  next
) => {
  const vendorName = req.body.vendorName;
  const address = req.body.address;
  const priceRange = req.body.priceRange;
  const phoneNumber = req.body.phoneNumber;
  const description = req.body.description;
  try {
    // Retrieve the existing vendor's profile
    assertIsDefined(req.session.vendorId);
    const vendor = await VendorModel.findById(req.session.vendorId).exec();
    if (!vendor) throw new Http_Errors.NotFound("Vendor profile");

    // Validate the existance of the required fields
    if (!vendorName || !address || !priceRange) throw new Http_Errors.MissingField();
    assertIsPriceRange(priceRange);

    // Update & save the vendor profile
    vendor.vendorName = vendorName;
    vendor.address = address;
    vendor.priceRange = priceRange;
    vendor.phoneNumber = phoneNumber;
    vendor.description = description;
    const updatedVendor = await vendor.save();

    res.status(200).json(updatedVendor);
  } catch (error) {
    next(error);
  }
};

/**
 * Add the provided cuisine to the vendor's list of cuisine type if it doesn't already exist in
 * the list. Otherwise remove it.
 *  - Prerequisite: Vendor's id must exist in session.
 *  - Params: None
 *  - Body: cuisine
 *  - Return: [String]
 */
export const toggleCuisine: RequestHandler<unknown, unknown, CuisineBody, unknown> = async (
  req,
  res,
  next
) => {
  const cuisine = req.body.cuisine;
  try {
    // Retrieve the vendor from the database
    assertIsDefined(req.session.vendorId);
    const vendor = await VendorModel.findById(req.session.vendorId).exec();
    if (!vendor) throw new Http_Errors.NotFound("Vendor profile");

    // Validate the existance of the required field
    if (!cuisine) throw new Http_Errors.MissingField();

    // Search the vendor's stored cuisine types & update as necessary
    const index = vendor.cuisineTypes.indexOf(cuisine);
    if (index === -1) vendor.cuisineTypes.push(cuisine);
    else vendor.cuisineTypes.splice(index, 1);
    const updatedVendor = await vendor.save();

    res.status(200).json(updatedVendor.cuisineTypes);
  } catch (error) {
    next(error);
  }
};
