import { RequestHandler } from "express";
import mongoose from "mongoose";
import * as Http_Errors from "../../errors/http_errors";
import MenuItemModel from "../../models/items/menuItem";
import VendorModel from "../../models/users/vendor";
import { assertIsDefined } from "../../util/assertIsDefined";
import { V_MP1 } from "../../util/interfaces";

/** "Type" of the HTTP request parameters when retrieving a menu. */
interface MenuParams {
  vendorId?: string;
}

/** "Type" of the HTTP request parameters when modifying a menu item. */
interface MenuItemParams {
  menuItemId?: string;
}

/** "Type" of the HTTP request body when creating/modifying a menu item. */
interface MenuItemBody {
  name?: string;
  price?: number;
  category?: string;
  description?: string;
  availability?: boolean;
}

/**
 * Retrieve the specified vendor's menu from the database.
 *  - Prequisite: None
 *  - Params: vendorId
 *  - Body: None
 *  - Return: [MenuItem]
 */
export const getMenu: RequestHandler<MenuParams, unknown, unknown, unknown> = async (
  req,
  res,
  next
) => {
  const unverifiedVendorId = req.params.vendorId;
  try {
    if (!mongoose.isValidObjectId(unverifiedVendorId))
      throw new Http_Errors.InvalidField("vendor id");
    const vendor = await VendorModel.findById(unverifiedVendorId).populate("menu").exec();
    if (!vendor) throw new Http_Errors.NotFound("Vendor");

    res.status(200).json(vendor.menu);
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieve a specified menu item from the database.
 *  - Prequisite: None
 *  - Params: menuItemId
 *  - Body: None
 *  - Return: MenuItem
 */
export const getMenuItem: RequestHandler<MenuItemParams, unknown, unknown, unknown> = async (
  req,
  res,
  next
) => {
  const unverifiedMenuItemId = req.params.menuItemId;
  try {
    if (!mongoose.isValidObjectId(unverifiedMenuItemId))
      throw new Http_Errors.InvalidField("menu item id");
    const verifiedMenuItem = await MenuItemModel.findById(unverifiedMenuItemId).exec();
    if (!verifiedMenuItem) throw new Http_Errors.NotFound("Menu item");

    res.status(200).json(verifiedMenuItem);
  } catch (error) {
    next(error);
  }
};

/**
 * Add a new menu item to the database and insert it into the vendor's menu.
 *  - Prerequisite: Vendor's id must exist in session.
 *  - Params: None
 *  - Body: name, price, category, description, availability
 *  - Return: MenuItem
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
    if (!vendor) throw new Http_Errors.NotFound("Vendor");

    // Validate the existance of the required fields
    if (!name || !price || !category || availablility === undefined)
      throw new Http_Errors.MissingField();

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
 * Update an existing menu item from the database.
 *  - Prerequisites:
 *    - Vendor's id must exist in session.
 *    - Menu item must belong to the vendor.
 *  - Params: menuItemId
 *  - Body: name, price, category, description, availability
 *  - Return: MenuItem
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
    // Verify the existance of the menu item id
    if (!mongoose.isValidObjectId(unverifiedMenuItemId))
      throw new Http_Errors.InvalidField("menu item id");

    // Verify the validity of vendor profile
    assertIsDefined(req.session.vendorId);
    const vendor = await VendorModel.findById(req.session.vendorId)
      .populate({
        path: "menu",
        match: { _id: unverifiedMenuItemId },
      })
      .exec();
    if (!vendor) throw new Http_Errors.NotFound("Vendor");

    // Verify that the menu item belongs to the vendor
    if (!vendor.menu.length) throw new Http_Errors.Unauthorized("Vendor", "menu item");

    // Verify the existance of the required fields
    if (!name || !price || !category || availablility === undefined)
      throw new Http_Errors.MissingField();

    // Update the menu item
    const updatedMenuItem = await MenuItemModel.findByIdAndUpdate(
      unverifiedMenuItemId,
      {
        name: name,
        price: price,
        available: availablility,
        category: category,
        description: description,
      },
      { new: true }
    ).exec();

    res.status(200).json(updatedMenuItem);
  } catch (error) {
    next(error);
  }
};

/**
 * Toggle the availability of an existing menu item from the database.
 *  - Prerequisites:
 *    - Vendor's id must exist in session.
 *    - Menu item must belong to the vendor.
 *  - Params: menuItemId
 *  - Body: None
 *  - Return: MenuItem
 */
export const toggleAvailability: RequestHandler<MenuItemParams, unknown, unknown, unknown> = async (
  req,
  res,
  next
) => {
  const unverifiedMenuItemId = req.params.menuItemId;
  try {
    // Verify the existance of the menu item id
    if (!mongoose.isValidObjectId(unverifiedMenuItemId))
      throw new Http_Errors.InvalidField("menu item id");

    // Verify the validity of vendor profile
    assertIsDefined(req.session.vendorId);
    const vendor: V_MP1 | null = await VendorModel.findById(req.session.vendorId)
      .populate({
        path: "menu",
        match: { _id: unverifiedMenuItemId },
      })
      .lean();
    if (!vendor) throw new Http_Errors.NotFound("Vendor");

    // Verify that the menu item belongs to the vendor
    if (!vendor.menu.length) throw new Http_Errors.Unauthorized("Vendor", "menu item");

    // Update the menu item
    const updatedMenuItem = await MenuItemModel.findByIdAndUpdate(
      unverifiedMenuItemId,
      {
        available: !vendor.menu[0].available,
      },
      { new: true }
    ).exec();

    res.status(200).json(updatedMenuItem);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete an existing menu item from the database and the vendor's menu.
 *  - Prerequisites:
 *    - Vendor's id must exist in session.
 *    - Menu item must belong to the vendor.
 *  - Params: menuItemId
 *  - Body: None
 *  - Return: String
 */
export const deleteMenuItem: RequestHandler<MenuItemParams, unknown, unknown, unknown> = async (
  req,
  res,
  next
) => {
  const unverifiedMenuItemId = req.params.menuItemId;
  try {
    // Verify the existance of the menu item id
    if (!mongoose.isValidObjectId(unverifiedMenuItemId))
      throw new Http_Errors.InvalidField("menu item id");

    // Verify the validity of vendor profile
    assertIsDefined(req.session.vendorId);
    const vendor = await VendorModel.findById(req.session.vendorId)
      .populate({
        path: "menu",
        match: { _id: unverifiedMenuItemId },
      })
      .exec();
    if (!vendor) throw new Http_Errors.NotFound("Vendor");

    // Verify that the menu item belongs to the vendor
    if (!vendor.menu.length) throw new Http_Errors.Unauthorized("Vendor", "menu item");

    // Delete the menu item from the vendor's menu
    await VendorModel.findByIdAndUpdate(req.session.vendorId, {
      $pull: { menu: unverifiedMenuItemId },
    }).exec();

    // Set the menu item to be deleted within 30 days
    await MenuItemModel.findByIdAndUpdate(unverifiedMenuItemId, {
      expireAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    }).exec();

    res.status(200).json({ message: "Menu item successfully deleted" });
  } catch (error) {
    next(error);
  }
};
