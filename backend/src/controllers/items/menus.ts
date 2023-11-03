import { RequestHandler } from "express";
import createHttpError from "http-errors";
import mongoose from "mongoose";
import MenuItemModel from "../../models/items/menuItem";
import VendorModel from "../../models/users/vendor";
import { assertIsDefined } from "../../util/assertIsDefined";

/** "Type" of the HTTP request parameters when modifying a menu item */
interface MenuItemParams {
  menuItemId?: string;
}

/** "Type" of the HTTP request body when creating/modifying a menu item */
interface MenuItemBody {
  name?: string;
  price?: number;
  category?: string;
  description?: string;
  availability?: boolean;
}

/** Retrieve the specified vendor's menu from the database. */
export const getMenu: RequestHandler = async (req, res, next) => {
  const unverifiedVendorId = req.params.vendorId;
  try {
    if (!mongoose.isValidObjectId(unverifiedVendorId))
      throw createHttpError(400, "Invalid vendor id: " + unverifiedVendorId);
    const vendor = await VendorModel.findById(unverifiedVendorId).populate("menu").exec();
    if (!vendor) throw createHttpError(404, "Vendor with id: " + unverifiedVendorId + " not found");

    res.status(200).json(vendor.menu);
  } catch (error) {
    next(error);
  }
};

/** Retrieve a specified menu item from the database. */
export const getMenuItem: RequestHandler = async (req, res, next) => {
  const unverifiedMenuItemId = req.params.menuItemId;
  try {
    if (!mongoose.isValidObjectId(unverifiedMenuItemId))
      throw createHttpError(400, "Invalid menu item id: " + unverifiedMenuItemId);
    const verifiedMenuItem = await MenuItemModel.findById(unverifiedMenuItemId).exec();
    if (!verifiedMenuItem)
      throw createHttpError(404, "Menu item with id: " + unverifiedMenuItemId + " not found");

    res.status(201).json(verifiedMenuItem);
  } catch (error) {
    next(error);
  }
};

/**
 * Add a new menu item to the database and to the vendor's menu.
 * Prerequisite: Vendor's id must exist in session.
 */
export const createMenuItem: RequestHandler<unknown, unknown, MenuItemBody, unknown> = async (
  req,
  res,
  next
) => {
  const name = req.body.name;
  const price = req.body.price;
  const category = req.body.category;
  const description = req.body.description;
  const availablility = req.body.availability;
  try {
    // Verify the validity of vendor profile
    assertIsDefined(req.session.vendorId);
    const vendor = await VendorModel.findById(req.session.vendorId).select("menu").exec();
    if (!vendor) throw createHttpError(404, "Vendor profile not found");

    // Validate the existance of the required fields
    if (!name || !price || !category || availablility === undefined)
      throw createHttpError(400, "A required field is missing");

    // Send the request to create the new menu item
    const newMenuItem = await MenuItemModel.create({
      name: name,
      price: price,
      available: availablility,
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

/**
 * Replace an existing menu item in the database.
 * Prerequisite: Vendor's id must exist in session.
 */
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
  const availablility = req.body.availability;
  try {
    // Verify the validity of vendor profile
    assertIsDefined(req.session.vendorId);
    const vendor = await VendorModel.findById(req.session.vendorId).select("menu").exec();
    if (!vendor) throw createHttpError(404, "Vendor profile not found");

    // Verify the existance of the required fields
    if (!name || !price || !category || availablility === undefined)
      throw createHttpError(400, "A required field is missing");

    // Verify the existance of the menu item id
    if (!mongoose.isValidObjectId(unverifiedMenuItemId))
      throw createHttpError(400, "Invalid menu item id: " + unverifiedMenuItemId);
    const verifiedMenuItem = await MenuItemModel.findById(unverifiedMenuItemId).exec();
    if (!verifiedMenuItem)
      throw createHttpError(404, "Menu item with id:" + unverifiedMenuItemId + " not found");

    // Verify that the menu item belongs to the vendor
    if (!vendor.menu.includes(verifiedMenuItem._id))
      throw createHttpError(403, "Menu item does not belong to the vendor");

    // Update the menu item
    (verifiedMenuItem.name = name), (verifiedMenuItem.price = price);
    (verifiedMenuItem.category = category), (verifiedMenuItem.description = description);
    verifiedMenuItem.available = availablility;
    const updatedMenuItem = await verifiedMenuItem.save();

    res.status(200).json(updatedMenuItem);
  } catch (error) {
    next(error);
  }
};

/**
 * Toggle the availability of an existing menu item from the database.
 * Prerequisite: Vendor's id must exist in session.
 */
export const toggleAvailability: RequestHandler = async (req, res, next) => {
  const unverifiedMenuItemId = req.params.menuItemId;
  try {
    // Verify the validity of vendor profile
    assertIsDefined(req.session.vendorId);
    const vendor = await VendorModel.findById(req.session.vendorId).select("menu").exec();
    if (!vendor) throw createHttpError(404, "Vendor profile not found");

    // Verify the existance of the menu item id
    if (!mongoose.isValidObjectId(unverifiedMenuItemId))
      throw createHttpError(400, "Invalid menu item id");
    const verifiedMenuItem = await MenuItemModel.findById(unverifiedMenuItemId).exec();
    if (!verifiedMenuItem) throw createHttpError(404, "Menu item not found");

    // Verify that the menu item belongs to the vendor
    const index = vendor.menu.indexOf(verifiedMenuItem._id);
    if (index === -1) throw createHttpError(403, "Menu item does not belong to the vendor");

    // Toggle the availability of the menu item
    verifiedMenuItem.available = !verifiedMenuItem.available;
    const updatedMenuItem = await verifiedMenuItem.save();

    res.status(200).json(updatedMenuItem);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete an existing menu item from the database and the vendor's menu.
 * Prerequisite: Vendor's id must exist in session.
 */
export const deleteMenuItem: RequestHandler = async (req, res, next) => {
  const unverifiedMenuItemId = req.params.menuItemId;
  try {
    // Verify the validity of vendor profile
    assertIsDefined(req.session.vendorId);
    const vendor = await VendorModel.findById(req.session.vendorId).select("menu").exec();
    if (!vendor) throw createHttpError(404, "Vendor profile not found");

    // Verify the existance of the menu item id
    if (!mongoose.isValidObjectId(unverifiedMenuItemId))
      throw createHttpError(400, "Invalid menu item id");
    const verifiedMenuItem = await MenuItemModel.findById(unverifiedMenuItemId).exec();
    if (!verifiedMenuItem) throw createHttpError(404, "Menu item not found");

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
