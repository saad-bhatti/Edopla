import { RequestHandler } from "express";
import mongoose from "mongoose";
import * as Http_Errors from "../../errors/http_errors";
import CartModel from "../../models/items/cartItem";
import BuyerModel from "../../models/users/buyer";
import VendorModel from "../../models/users/vendor";
import { assertIsDefined } from "../../util/assertIsDefined";
import { B_CP1, CI_U } from "../../util/interfaces";

/** "Type" of the HTTP request parameters when modifying a cart. */
interface CartParams {
  cartId: string;
}

/** "Type" of the HTTP request body when creating a cart. */
interface CreateCartBody {
  vendorId?: string;
  items?: [string];
  itemsQuantity?: [number];
}

/** "Type" of the HTTP request body when updating a cart. */
interface UpdateCartBody {
  items?: [string];
  itemsQuantity?: [number];
}

/**
 * Retrieve all carts of the buyer from the database.
 *  - Prerequisite: Buyer's id must exist in session.
 *  - Params: None
 *  - Body: None
 *  - Return: [Cart]
 */
export const getCarts: RequestHandler<unknown, unknown, unknown, unknown> = async (
  req,
  res,
  next
) => {
  try {
    // Verify the validity of buyer profile
    assertIsDefined(req.session.buyerId);
    const buyer = await BuyerModel.findById(req.session.buyerId)
      .populate({
        path: "carts",
        populate: {
          path: "vendorId",
          select: "vendorName",
          model: "Vendor",
        },
      })
      .populate({
        path: "carts",
        populate: {
          path: "items",
          select: "name price",
          model: "MenuItem",
        },
      })
      .exec();
    if (!buyer) throw new Http_Errors.NotFound("Buyer");

    res.status(200).json(buyer.carts);
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieve a cart specified by its id from the database.
 *  - Prerequisite:
 *    - Buyer's id must exist in session.
 *    - The cart must belong to the buyer
 *  - Params: cartId
 *  - Body: None
 *  - Return: [Cart]
 */
export const getCart: RequestHandler<CartParams, unknown, unknown, unknown> = async (
  req,
  res,
  next
) => {
  const unverifiedCartId = req.params.cartId;
  try {
    // Verify the validity of the cart id
    if (!mongoose.isValidObjectId(unverifiedCartId)) throw new Http_Errors.InvalidField("cart id");

    // Verify the validity of buyer profile
    assertIsDefined(req.session.buyerId);
    const buyer = await BuyerModel.findById(req.session.buyerId)
      .populate({
        path: "carts",
        match: { _id: unverifiedCartId },
        populate: { path: "items", select: "name price" },
      })
      .exec();
    if (!buyer) throw new Http_Errors.NotFound("Buyer");

    // Verify that the cart belongs to the buyer
    if (!buyer.carts.length) throw new Http_Errors.Unauthorized("Buyer", "cart");
    const verifiedCart = buyer.carts[0];

    res.status(200).json(verifiedCart);
  } catch (error) {
    next(error);
  }
};

/**
 * Add a new cart to the database and update the buyer's profile.
 *  - Prerequisite:
 *    - Buyer's id must exist in session
 *    - A cart with the same vendor id must not exist in the buyer's carts
 *    - All items must belong to the specified vendor
 *  - Params: None
 *  - Body: vendorId, items, itemsQuantity
 *  - Return: Cart
 */
export const createCart: RequestHandler<unknown, unknown, CreateCartBody, unknown> = async (
  req,
  res,
  next
) => {
  const vendorId = req.body.vendorId;
  const items = req.body.items;
  const itemsQuantity = req.body.itemsQuantity;
  try {
    // Verify the validity of buyer profile
    assertIsDefined(req.session.buyerId);
    const buyer: B_CP1 | null = await BuyerModel.findById(req.session.buyerId)
      .populate("carts")
      .lean();
    if (!buyer) throw new Http_Errors.NotFound("Buyer");

    // Validate the existance of the provided fields
    if (!vendorId || !items || !itemsQuantity) throw new Http_Errors.MissingField();
    if (!items.length || items.length !== itemsQuantity.length)
      throw new Http_Errors.CustomError("items and their quantities must be equal in size", 400);
    if (items.length !== new Set(items).size)
      throw new Http_Errors.CustomError("Duplicate items are not allowed", 400);

    // Verify the validity of vendor id
    if (!mongoose.isValidObjectId(vendorId)) throw new Http_Errors.InvalidField("vendor id");
    const verifiedVendor = await VendorModel.findById(vendorId).select("menu").exec();
    if (!verifiedVendor) throw new Http_Errors.NotFound("Vendor");

    // Verify that a cart with vendorId does not already exist in the carts
    buyer.carts.forEach((cart: CI_U) => {
      if (cart.vendorId.equals(verifiedVendor._id))
        throw new Http_Errors.AlreadyExists("A cart with this vendor");
    });

    // Verify the quantity of each item is not zero
    itemsQuantity.forEach((quantity) => {
      if (quantity <= 0) throw new Http_Errors.InvalidField("item quantity");
    });

    // Verify validity of each item and its ownership to the vendor
    items.forEach((unverifiedItemId) => {
      if (!mongoose.isValidObjectId(unverifiedItemId))
        throw new Http_Errors.InvalidField("item id");
      const verifiedItemId = new mongoose.Types.ObjectId(unverifiedItemId);
      const index = verifiedVendor.menu.indexOf(verifiedItemId);
      if (index === -1) throw new Http_Errors.Unauthorized("Vendor", "item");
    });

    // Create the maps for the items and their quantities
    const itemsMap = new Map();
    const itemsQuantityMap = new Map();
    let key;
    for (let i = 0; i < items.length; i++) {
      key = i.toString();
      itemsMap.set(key, items[i]);
      itemsQuantityMap.set(key, itemsQuantity[i]);
    }

    // Send the request to create the cart and add it to the buyer's carts
    const newCart = await CartModel.create({
      vendorId: verifiedVendor._id,
      items: itemsMap,
      itemsQuantity: itemsQuantityMap,
      savedForLater: false,
    });
    BuyerModel.findByIdAndUpdate(buyer._id, { $push: { carts: newCart._id } }).exec();

    res.status(201).json(newCart);
  } catch (error) {
    next(error);
  }
};

/**
 * Update an existing cart to the database.
 *  - Prerequisite:
 *    - Buyer's id must exist in session
 *    - The cart must belong to the buyer
 *    - All items must belong to the existing vendor
 *  - Params: cartId
 *  - Body: items, itemsQuantity
 *  - Return: Cart
 */
export const updateCart: RequestHandler<CartParams, unknown, UpdateCartBody, unknown> = async (
  req,
  res,
  next
) => {
  const unverifiedCartId = req.params.cartId;
  const items = req.body.items;
  const itemsQuantity = req.body.itemsQuantity;
  try {
    // Verify the validity of the cart id
    if (!mongoose.isValidObjectId(unverifiedCartId)) throw new Http_Errors.InvalidField("cart id");

    // Verify the validity of buyer profile
    assertIsDefined(req.session.buyerId);
    const buyer: B_CP1 | null = await BuyerModel.findById(req.session.buyerId)
      .populate({ path: "carts", match: { _id: unverifiedCartId } })
      .lean();
    if (!buyer) throw new Http_Errors.NotFound("Buyer");

    // Verify that the cart belongs to the buyer
    if (!buyer.carts.length) throw new Http_Errors.Unauthorized("Buyer", "cart");
    const verifiedCart = buyer.carts[0];

    // Validate the existance of the provided fields
    if (!items || !itemsQuantity) throw new Http_Errors.MissingField();
    if (!items.length || items.length !== itemsQuantity.length)
      throw new Http_Errors.CustomError("items and their quantities must be equal in size", 400);
    if (items.length !== new Set(items).size)
      throw new Http_Errors.CustomError("Duplicate items are not allowed", 400);

    // Verify validity of each item and its ownership to the vendor
    const verifiedVendor = await VendorModel.findById(verifiedCart.vendorId).select("menu").exec();
    if (!verifiedVendor) throw new Http_Errors.NotFound("Vendor");
    items.forEach((unverifiedItemId) => {
      if (!mongoose.isValidObjectId(unverifiedItemId))
        throw new Http_Errors.InvalidField("item id");
      const verifiedItemId = new mongoose.Types.ObjectId(unverifiedItemId);
      const index = verifiedVendor.menu.indexOf(verifiedItemId);
      if (index === -1)
        throw new Http_Errors.Unauthorized("Vendor", "item");
    });

    // Create the maps for the items and their quantities
    const updatedItemsMap = new Map();
    const updatedItemsQuantityMap = new Map();
    let key;
    for (let i = 0; i < items.length; i++) {
      key = i.toString();
      updatedItemsMap.set(key, items[i]);
      updatedItemsQuantityMap.set(key, itemsQuantity[i]);
    }

    // Update the cart
    const updatedCart = await CartModel.findByIdAndUpdate(
      verifiedCart._id,
      {
        items: updatedItemsMap,
        itemsQuantity: updatedItemsQuantityMap,
      },
      { new: true }
    ).exec();

    res.status(200).json(updatedCart);
  } catch (error) {
    next(error);
  }
};

/**
 * Toggle the savedForLater field of an existing cart.
 *  - Prerequisite:
 *    - Buyer's id must exist in session
 *    - The cart must belong to the buyer
 *  - Params: cartId
 *  - Body: None
 *  - Return: Cart
 */
export const toggleSaveForLater: RequestHandler<CartParams, unknown, unknown, unknown> = async (
  req,
  res,
  next
) => {
  const unverifiedCartId = req.params.cartId;
  try {
    // Verify the validity of the cart id
    if (!mongoose.isValidObjectId(unverifiedCartId)) throw new Http_Errors.InvalidField("cart id");

    // Verify the validity of buyer profile
    assertIsDefined(req.session.buyerId);
    const buyer: B_CP1 | null = await BuyerModel.findById(req.session.buyerId)
      .populate({ path: "carts", match: { _id: unverifiedCartId } })
      .lean();
    if (!buyer) throw new Http_Errors.NotFound("Buyer");

    // Verify that the cart belongs to the buyer
    if (!buyer.carts.length) throw new Http_Errors.Unauthorized("Buyer", "cart");
    const verifiedCart = buyer.carts[0];

    // Toggle the savedForLater field of the cart
    const updatedCart = await CartModel.findByIdAndUpdate(
      verifiedCart._id,
      { savedForLater: !verifiedCart.savedForLater },
      { new: true }
    ).exec();

    res.status(200).json(updatedCart);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete all existing carts from the buyer's carts in the database.
 *  - Prerequisite: Buyer's id must exist in session.
 *  - Params: None
 *  - Body: None
 *  - Return: String
 */
export const emptyCarts: RequestHandler<unknown, unknown, unknown, unknown> = async (
  req,
  res,
  next
) => {
  try {
    // Verify the validity of buyer profile
    assertIsDefined(req.session.buyerId);
    const buyer = await BuyerModel.findById(req.session.buyerId).exec();
    if (!buyer) throw new Http_Errors.NotFound("Buyer");

    // Delete all carts from the buyer's carts & reset the carts
    await CartModel.deleteMany({ _id: { $in: buyer.carts } }).exec();
    buyer.carts = [];
    await buyer.save();

    res.status(200).json({ message: "Carts successfully deleted" });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete an existing cart item from the database and the buyer's cart.
 *  - Prerequisites:
 *    - Buyer's id must exist in session.
 *    - The cart must belong to the buyer
 *  - Params: cartId
 *  - Body: None
 *  - Return: String
 */
export const emptyCart: RequestHandler<CartParams, unknown, unknown, unknown> = async (
  req,
  res,
  next
) => {
  const unverifiedCartId = req.params.cartId;
  try {
    // Verify the validity of the cart id
    if (!mongoose.isValidObjectId(unverifiedCartId)) throw new Http_Errors.InvalidField("cart id");

    // Verify the validity of buyer profile
    assertIsDefined(req.session.buyerId);
    const buyer = await BuyerModel.findById(req.session.buyerId)
      .populate("carts", {
        match: {
          _id: unverifiedCartId,
        },
      })
      .exec();
    if (!buyer) throw new Http_Errors.NotFound("Buyer");

    // Verify that the cart belongs to the buyer
    if (!buyer.carts.length) throw new Http_Errors.Unauthorized("Buyer", "cart");

    // Delete the cart from the buyer's carts & delete the cart
    await BuyerModel.findByIdAndUpdate(buyer._id, { $pull: { carts: unverifiedCartId } }).exec();
    await CartModel.findByIdAndDelete(unverifiedCartId).exec();

    res.status(200).json({ message: "Cart successfully deleted" });
  } catch (error) {
    next(error);
  }
};
