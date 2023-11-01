import { RequestHandler } from "express";
import createHttpError from "http-errors";
import mongoose from "mongoose";
import MenuItemModel from "../models/menuItem";
import VendorModel from "../models/users/vendor";
import { assertIsDefined } from "../util/assertIsDefined";

/** Retrieve a menu item from the database. */
export const getMentItem: RequestHandler = async (req, res, next) => {
  const unverifiedMenuItemId = req.params.menuItemId;
  try {
    // Verify the existance of the menu item id
    if (!mongoose.isValidObjectId(unverifiedMenuItemId))
      throw createHttpError(400, "Invalid menu item id");
    const verifiedMenuItem = await MenuItemModel.findById(unverifiedMenuItemId).exec();
    if (!verifiedMenuItem) throw createHttpError(404, "Menu item not found");

    res.status(201).json(verifiedMenuItem);
  } catch (error) {
    next(error);
  }
};

// "Type" of the HTTP request body when creating/modifying a menu item
interface MenuItemBody {
  name?: string;
  price?: number;
  category?: string;
  description?: string;
}

/** Add a new menu item to the database. Note that the item is initialized to
 * be unavailable by default. */
export const createMenuItem: RequestHandler<unknown, unknown, MenuItemBody, unknown> = async (
  req,
  res,
  next
) => {
  const name = req.body.name;
  const price = req.body.price;
  const category = req.body.category;
  const description = req.body.description;
  try {
    // Validate the existance of the required fields
    if (!name || !price || !category) throw createHttpError(400, "A required field is missing");

    // Verify the validity of vendor profile
    assertIsDefined(req.session.vendorId);
    const vendor = await VendorModel.findById(req.session.vendorId).exec();
    if (!vendor) throw createHttpError(404, "Vendor profile not found");

    // Send the request to create the new menu item
    const newMenuItem = await MenuItemModel.create({
      name: name,
      price: price,
      available: false,
      category: category,
      description: description,
      expireAt: undefined,
    });

    // Add the menu item to the vendor's menu
    vendor.menu.push(newMenuItem._id);
    await vendor.save();

    res.status(201).json(newMenuItem);
  } catch (error) {
    next(error);
  }
};

// "Type" of the HTTP request parameters when modifying a menu item
interface MenuItemParams {
  menuItemId?: string;
}

/** Update an existing menu item in the database. */
export const updateMenuItem: RequestHandler<
  MenuItemParams,
  unknown,
  MenuItemBody,
  unknown
> = async (req, res, next) => {
  const unverifiedMenuItemId = req.params.menuItemId;
  const name = req.body.name;
  const price = req.body.price;
  const category = req.body.category;
  const description = req.body.description;
  try {
    // Verify the existance of the required fields
    if (!name || !price || !category) throw createHttpError(400, "A required field is missing");

    // Verify the existance of the menu item id
    if (!mongoose.isValidObjectId(unverifiedMenuItemId))
      throw createHttpError(400, "Invalid menu item id");
    const verifiedMenuItem = await MenuItemModel.findById(unverifiedMenuItemId).exec();
    if (!verifiedMenuItem) throw createHttpError(404, "Menu item not found");

    // Verify the validity of vendor profile
    assertIsDefined(req.session.vendorId);
    const vendor = await VendorModel.findById(req.session.vendorId).exec();
    if (!vendor) throw createHttpError(404, "Vendor profile not found");

    // Verify that the menu item belongs to the vendor
    if (!vendor.menu.includes(verifiedMenuItem._id))
      throw createHttpError(403, "Menu item does not belong to the vendor");

    // Update the menu item
    (verifiedMenuItem.name = name), (verifiedMenuItem.price = price);
    (verifiedMenuItem.category = category), (verifiedMenuItem.description = description);
    const updatedMenuItem = await verifiedMenuItem.save();

    res.status(200).json(updatedMenuItem);
  } catch (error) {
    next(error);
  }
};

/** Toggle the availability of an existing menu item from the database. */
export const toggleMenuItemAvailability: RequestHandler = async (req, res, next) => {
  const unverifiedMenuItemId = req.params.menuItemId;
  try {
    // Verify the existance of the menu item id
    if (!mongoose.isValidObjectId(unverifiedMenuItemId))
      throw createHttpError(400, "Invalid menu item id");
    const verifiedMenuItem = await MenuItemModel.findById(unverifiedMenuItemId).exec();
    if (!verifiedMenuItem) throw createHttpError(404, "Menu item not found");

    // Verify the validity of vendor profile
    assertIsDefined(req.session.vendorId);
    const vendor = await VendorModel.findById(req.session.vendorId).exec();
    if (!vendor) throw createHttpError(404, "Vendor profile not found");

    // Verify that the menu item belongs to the vendor
    const index = vendor.menu.indexOf(verifiedMenuItem._id);
    if (index === -1) throw createHttpError(403, "Menu item does not belong to the vendor");

    // Toggle the availability of the menu item
    verifiedMenuItem.available = !verifiedMenuItem.available;
    await verifiedMenuItem.save();

    res.status(200).json({ message: "Menu item's availability successfully toggled" });
  } catch (error) {
    next(error);
  }
};

/** Delete an existing menu item from the database. */
export const deleteMenuItem: RequestHandler = async (req, res, next) => {
  const unverifiedMenuItemId = req.params.menuItemId;
  try {
    // Verify the existance of the menu item id
    if (!mongoose.isValidObjectId(unverifiedMenuItemId))
      throw createHttpError(400, "Invalid menu item id");
    const verifiedMenuItem = await MenuItemModel.findById(unverifiedMenuItemId).exec();
    if (!verifiedMenuItem) throw createHttpError(404, "Menu item not found");

    // Verify the validity of vendor profile
    assertIsDefined(req.session.vendorId);
    const vendor = await VendorModel.findById(req.session.vendorId).exec();
    if (!vendor) throw createHttpError(404, "Vendor profile not found");

    // Verify that the menu item belongs to the vendor
    const index = vendor.menu.indexOf(verifiedMenuItem._id);
    if (index === -1) throw createHttpError(403, "Menu item does not belong to the vendor");

    // Delete the menu item from the vendor's menu
    vendor.menu.splice(index, 1);
    await vendor.save();

    // Set the menu item to be deleted within 30 days
    verifiedMenuItem.expireAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    await verifiedMenuItem.save();

    res.status(200).json({ message: "Menu item successfully deleted" });
  } catch (error) {
    next(error);
  }
};
