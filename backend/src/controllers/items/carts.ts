import { RequestHandler } from "express";
import createHttpError from "http-errors";
import mongoose, { Types } from "mongoose";
import CartModel from "../../models/items/cartItem";
import BuyerModel from "../../models/users/buyer";
import VendorModel from "../../models/users/vendor";
import { assertIsDefined } from "../../util/assertIsDefined";

/** "Type" of the cart item in the database */
interface CartItem {
  _id: Types.ObjectId;
  vendorId: Types.ObjectId;
  items: Map<string, Types.ObjectId>;
  itemsQuantity: Map<string, number>;
  savedForLater: boolean;
}

/** "Type" of the buyer profile in the database */
interface Buyer {
  _id: Types.ObjectId;
  buyerName: string;
  address: string;
  phoneNumber?: string;
  carts: Types.Array<CartItem>;
  savedVendors: Types.Array<Types.ObjectId>;
  orders: Types.Array<Types.ObjectId>;
}

/** "Type" of the HTTP request parameters when modifying a cart */
interface CartParams {
  cartId: string;
}

/** "Type" of the HTTP request body when creating a cart */
interface CreateCartBody {
  vendorId?: string;
  items?: [string];
  itemsQuantity?: [number];
}

/** "Type" of the HTTP request body when creating a cart */
interface UpdateCartBody {
  items?: [string];
  itemsQuantity?: [number];
}

/**
 * Retrieve all carts of the buyer from the database.
 * Prerequisite: Buyer's id must exist in session.
 */
export const getCarts: RequestHandler = async (req, res, next) => {
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
    if (!buyer) throw createHttpError(404, "Buyer profile not found");

    res.status(200).json(buyer.carts);
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieve a cart specified by its id from the database.
 * Prerequisites:
 *  - Buyer's id must exist in session
 *  - The cart must belong to the buyer
 */
export const getCart: RequestHandler = async (req, res, next) => {
  try {
    // Verify the validity of buyer profile
    assertIsDefined(req.session.buyerId);
    const buyer = await BuyerModel.findById(req.session.buyerId).exec();
    if (!buyer) throw createHttpError(404, "Buyer profile not found");

    // Verify the validity of cart id
    const unverifiedCartId = req.params.cartId;
    if (!mongoose.isValidObjectId(unverifiedCartId)) throw createHttpError(400, "Invalid cart id");
    const verifiedCart = await CartModel.findById(unverifiedCartId)
      .populate("vendorId items", "vendorName name price")
      .exec();
    if (!verifiedCart) throw createHttpError(404, "Cart not found");

    // Verify that the cart belongs to the buyer
    const index = buyer.carts.indexOf(verifiedCart._id);
    if (index === -1) throw createHttpError(403, "Cart does not belong to buyer");

    res.status(200).json(verifiedCart);
  } catch (error) {
    next(error);
  }
};

/**
 * Add a new cart to the database and update the buyer's profile.
 * Prerequisite:
 *  - Buyer's id must exist in session
 *  - A cart with the same vendor id must not exist in the buyer's carts
 *  - All items must belong to the specified vendor
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
    const buyer: Buyer | null = await BuyerModel.findById(req.session.buyerId)
      .populate("carts")
      .lean();
    if (!buyer) throw createHttpError(404, "Buyer profile not found");

    // Validate the existance of the provided fields
    if (!vendorId || !items || !itemsQuantity)
      throw createHttpError(400, "A required field is missing");
    if (!items.length || items.length !== itemsQuantity.length)
      throw createHttpError(400, "items and itemsQuantity must have the same non-empty length");
    if (items.length !== new Set(items).size)
      throw createHttpError(400, "Duplicate items are not allowed");

    // Verify the validity of vendor id
    if (!mongoose.isValidObjectId(vendorId)) throw createHttpError(400, "Invalid vendor id");
    const verifiedVendor = await VendorModel.findById(vendorId).select("menu").exec();
    if (!verifiedVendor) throw createHttpError(404, "Vendor not found");

    // Verify that a cart with vendorId does not already exist in the carts
    buyer.carts.forEach((cart: CartItem) => {
      if (cart.vendorId.equals(verifiedVendor._id))
        throw createHttpError(409, "Vendor already has an existing cart");
    });

    // Verify validity of each item and its ownership to the vendor
    items.forEach((unverifiedItemId) => {
      if (!mongoose.isValidObjectId(unverifiedItemId))
        throw createHttpError(400, "Invalid item id: " + unverifiedItemId);
      const verifiedItemId = new mongoose.Types.ObjectId(unverifiedItemId);
      const index = verifiedVendor.menu.indexOf(verifiedItemId);
      if (index === -1)
        throw createHttpError(400, "Item '" + verifiedItemId + "' does not belong to the vendor");
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
 * Prerequisite:
 *  - Buyer's id must exist in session
 *  - The cart must belong to the buyer
 *  - All items must belong to the existing vendor
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
    if (!mongoose.isValidObjectId(unverifiedCartId))
      throw createHttpError(400, "Invalid cart id: " + unverifiedCartId);

    // Verify the validity of buyer profile
    assertIsDefined(req.session.buyerId);
    const buyer: Buyer | null = await BuyerModel.findById(req.session.buyerId)
      .populate({ path: "carts", match: { _id: unverifiedCartId } })
      .lean();
    if (!buyer) throw createHttpError(404, "Buyer profile not found");

    // Verify that the cart belongs to the buyer
    if (!buyer.carts.length)
      throw createHttpError(403, "Cart id '" + unverifiedCartId + "' is not owned by the buyer");
    const verifiedCart = buyer.carts[0];

    // Validate the existance of the provided fields
    if (!items || !itemsQuantity) throw createHttpError(400, "A required field is missing");
    if (!items.length || items.length !== itemsQuantity.length)
      throw createHttpError(400, "items and itemsQuantity must have the same non-empty length");
    if (items.length !== new Set(items).size)
      throw createHttpError(400, "Duplicate items are not allowed");

    // Verify validity of each item and its ownership to the vendor
    const verifiedVendor = await VendorModel.findById(verifiedCart.vendorId).select("menu").exec();
    if (!verifiedVendor) throw createHttpError(404, "Vendor not found");
    items.forEach((unverifiedItemId) => {
      if (!mongoose.isValidObjectId(unverifiedItemId))
        throw createHttpError(400, "Invalid item id: " + unverifiedItemId);
      const verifiedItemId = new mongoose.Types.ObjectId(unverifiedItemId);
      const index = verifiedVendor.menu.indexOf(verifiedItemId);
      if (index === -1)
        throw createHttpError(400, "Item '" + verifiedItemId + "' does not belong to the vendor");
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
 * Prerequisite:
 *  - Buyer's id must exist in session
 *  - The cart must belong to the buyer
 */
export const toggleSaveForLater: RequestHandler = async (req, res, next) => {
  const unverifiedCartId = req.params.cartId;
  try {
    // Verify the validity of the cart id
    if (!mongoose.isValidObjectId(unverifiedCartId))
      throw createHttpError(400, "Invalid cart id: " + unverifiedCartId);

    // Verify the validity of buyer profile
    assertIsDefined(req.session.buyerId);
    const buyer: Buyer | null = await BuyerModel.findById(req.session.buyerId)
      .populate({ path: "carts", match: { _id: unverifiedCartId } })
      .lean();
    if (!buyer) throw createHttpError(404, "Buyer profile not found");

    // Verify that the cart belongs to the buyer
    if (!buyer.carts.length)
      throw createHttpError(403, "Cart id '" + unverifiedCartId + "' is not owned by the buyer");
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
 * Delete all existing carts from the database and the buyer's carts.
 * Prerequisite: Buyer's id must exist in session.
 */
export const emptyCarts: RequestHandler = async (req, res, next) => {
  try {
    // Verify the validity of buyer profile
    assertIsDefined(req.session.buyerId);
    const buyer = await BuyerModel.findById(req.session.buyerId).exec();
    if (!buyer) throw createHttpError(404, "Buyer profile not found");

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
 * Prerequisite: Buyer's id must exist in session.
 */
export const emptyCart: RequestHandler = async (req, res, next) => {
  const unverifiedCartId = req.params.cartId;
  try {
    // Verify the validity of buyer profile
    assertIsDefined(req.session.buyerId);
    const buyer = await BuyerModel.findById(req.session.buyerId).exec();
    if (!buyer) throw createHttpError(404, "Buyer profile not found");

    // Verify the existance of the cart id
    if (!mongoose.isValidObjectId(unverifiedCartId)) throw createHttpError(400, "Invalid cart id");
    const verifiedCart = await CartModel.findById(unverifiedCartId).exec();
    if (!verifiedCart)
      throw createHttpError(404, "Cart with id: " + unverifiedCartId + " not found");

    // Verify that the cart belongs to the buyer
    const index = buyer.carts.indexOf(verifiedCart._id);
    if (index === -1) throw createHttpError(403, "Cart does not belong to the buyer");

    // Delete the cart from the buyer's carts & delete the cart
    buyer.carts.splice(index, 1);
    await buyer.save();
    await verifiedCart.deleteOne();

    res.status(200).json({ message: "Cart successfully deleted" });
  } catch (error) {
    next(error);
  }
};
