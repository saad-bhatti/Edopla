import { RequestHandler } from "express";
import createHttpError from "http-errors";
import UserModel from "../../models/users/user";
import VendorModel from "../../models/users/vendor";
import { assertIsDefined } from "../../util/assertIsDefined";
import { assertIsPriceRange } from "../../util/assertIsPriceRange";

/** Retrieve a vendor's profile from the database. */
export const getProfile: RequestHandler = async (req, res, next) => {
  try {
    assertIsDefined(req.session.vendorId);
    const vendor = await VendorModel.findById(req.session.vendorId).exec();
    if (!vendor) throw createHttpError(404, "Vendor profile not found");

    res.status(200).json(vendor);
  } catch (error) {
    next(error);
  }
};

// "Type" of the HTTP request body when creating/modifying a vendor profile
interface ProfileBody {
  vendorName?: string;
  address?: string;
  priceRange?: string;
  phoneNumber?: string;
  description?: string;
}

/** Add a new vendor profile to the database and update the user's profile. */
export const createProfile: RequestHandler<unknown, unknown, ProfileBody, unknown> = async (
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
    // Validate the provided fields
    if (!vendorName || !address || !priceRange)
      throw createHttpError(400, "A required field is missing");
    assertIsPriceRange(priceRange);

    // Verify the validity of the user with no pre-existing vendor's profile
    assertIsDefined(req.session.userId);
    const user = await UserModel.findById(req.session.userId).exec();
    if (!user) throw createHttpError(404, "User not found");
    if (user._vendor) throw createHttpError(409, "User already has a vendor profile");

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

/** Update an existing vendor's profile. */
export const updateProfile: RequestHandler<unknown, unknown, ProfileBody, unknown> = async (
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
    // Validate the existance of the required fields
    if (!vendorName || !address || !priceRange)
      throw createHttpError(400, "A required field is missing");
    assertIsPriceRange(priceRange);

    // Retrieve the existing vendor's profile
    assertIsDefined(req.session.vendorId);
    const vendor = await VendorModel.findById(req.session.vendorId).exec();
    if (!vendor) throw createHttpError(404, "Vendor profile not found");

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

// "Type" of the HTTP request body when modifying a vendor's cuisine types
interface CuisineBody {
  cuisine: string;
}

/** If the provided cuisine already exists for the vendor, the type is
 * removed from the vendor's stored cuisine types. Otherwise, the cuisine is
 * added to the vendor's stored cuisine types. */
export const updatedCuisine: RequestHandler<unknown, unknown, CuisineBody, unknown> = async (
  req,
  res,
  next
) => {
  const cuisine = req.body.cuisine;
  try {
    // Validate the existance of the required field
    if (!cuisine) throw createHttpError(400, "A required field is missing");

    // Retrieve the vendor from the database
    assertIsDefined(req.session.vendorId);
    const vendor = await VendorModel.findById(req.session.vendorId).exec();
    if (!vendor) throw createHttpError(404, "Vendor profile not found");

    // Search the vendor's stored cuisine types & update as necessary
    const index = vendor.cuisineTypes.indexOf(cuisine);
    if (index === -1) vendor.cuisineTypes.push(cuisine);
    else vendor.cuisineTypes.splice(index, 1);
    const updatedVendor = await vendor.save();

    res.status(200).json(updatedVendor);
  } catch (error) {
    next(error);
  }
};
