import { RequestHandler } from "express";
import mongoose, { ObjectId } from "mongoose";
import * as Http_Errors from "../../errors/http_errors";
import CartModel from "../../models/items/cartItem";
import BuyerModel from "../../models/users/buyer";
import VendorModel from "../../models/users/vendor";
import { assertIsDefined } from "../../util/assertIsDefined";
import { Buyer, CartItem } from "../../util/interfaces";
import { isCartItem, isObjectId } from "../../util/typeGuard";

/** "Type" of the HTTP request parameters when retrieving a cart. */
interface CartParams {
  cartId: string;
}

/** "Type" of the HTTP request body when creating a cart. */
interface CreateCartBody {
  vendorId?: string;
  items?: { item: string; quantity: number }[];
}

/** "Type" of the HTTP request body when updating a cart. */
interface UpdateCartBody {
  items?: { item: string; quantity: number }[];
}

/** "Type" of the HTTP request body when updating an item within a cart. */
interface UpdateItemBody {
  item?: { item: string; quantity: number };
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
          model: "Vendor",
        },
      })
      .populate({
        path: "carts",
        populate: {
          path: "items.item",
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
        populate: { path: "vendorId items.item" },
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
 *  - Body: vendorId - Types.ObjectId, items - [{item: Types.ObjectId, quantity: number}]
 *  - Return: Cart
 */
export const createCart: RequestHandler<unknown, unknown, CreateCartBody, unknown> = async (
  req,
  res,
  next
) => {
  const vendorId = req.body.vendorId;
  const items = req.body.items;
  try {
    // Part 1: Verify the validity of buyer profile
    assertIsDefined(req.session.buyerId);
    const buyer: Buyer | null = await BuyerModel.findById(req.session.buyerId)
      .populate("carts")
      .lean();
    if (!buyer) throw new Http_Errors.NotFound("Buyer");

    // Part 2: Validate the existance of the provided fields
    if (!vendorId || !items) throw new Http_Errors.MissingField();

    // Part 3: Verify vendor id and there is no existing cart with vendor id
    // Verify the validity of vendor id
    if (!mongoose.isValidObjectId(vendorId)) throw new Http_Errors.InvalidField("vendor id");
    const verifiedVendor = await VendorModel.findById(vendorId).select("menu").exec();
    if (!verifiedVendor) throw new Http_Errors.NotFound("Vendor");

    // Verify that a cart with vendorId does not already exist in the carts
    buyer.carts.forEach((cart: ObjectId | CartItem) => {
      let verifiedCart: CartItem | null = null;
      if (!isCartItem(cart)) throw new Error("Cart item is not a valid CartItem");
      else verifiedCart = cart as CartItem;

      if (verifiedCart.vendorId.toString() === verifiedVendor._id.toString())
        throw new Http_Errors.AlreadyExists("A cart with this vendor");
    });

    // Part 4: items verification
    const uniqueItems = new Set();
    items.forEach(({ item, quantity }) => {
      // Verify validity of each item and its ownership to the vendor
      if (!mongoose.isValidObjectId(item)) throw new Http_Errors.InvalidField("item id");
      const verifiedItemId = new mongoose.Types.ObjectId(item);
      const index = verifiedVendor.menu.indexOf(verifiedItemId);
      if (index === -1) throw new Http_Errors.Unauthorized("Vendor", "item");

      // Verify that there are no duplicate items
      if (uniqueItems.has(item))
        throw new Http_Errors.CustomError("Duplicate items are not allowed", 400);
      uniqueItems.add(item);

      // Verify the quantity of each item is not zero
      if (quantity <= 0) throw new Http_Errors.InvalidField("item quantity");
    });

    // Part 5: Send the request to create the cart and add it to the buyer's carts
    const newCart = await CartModel.create({
      vendorId: verifiedVendor._id,
      items: items,
      savedForLater: false,
    });
    BuyerModel.findByIdAndUpdate(buyer._id, { $push: { carts: newCart._id } }).exec();

    // Part 6: Send the response
    const populatedCart = await CartModel.findById(newCart._id).populate("vendorId items.item");
    res.status(201).json(populatedCart);
  } catch (error) {
    next(error);
  }
};

/**
 * Replaces the items field of an existing cart in the database.
 *  - Prerequisite:
 *    - Buyer's id must exist in session
 *    - The cart must belong to the buyer
 *    - All items must belong to the existing vendor
 *  - Params: cartId
 *  - Body: items - [{item: Types.ObjectId, quantity: number}]
 *  - Return: Cart
 */
export const updateCart: RequestHandler<CartParams, unknown, UpdateCartBody, unknown> = async (
  req,
  res,
  next
) => {
  const unverifiedCartId = req.params.cartId;
  const items = req.body.items;
  try {
    // Part 1: Verify the validity of buyer profile
    assertIsDefined(req.session.buyerId);
    const buyer: Buyer | null = await BuyerModel.findById(req.session.buyerId)
      .populate({ path: "carts", match: { _id: unverifiedCartId } })
      .lean();
    if (!buyer) throw new Http_Errors.NotFound("Buyer");

    // Part 2: Verify the cart id and its ownership to the buyer
    // Verify the validity of the cart id
    if (!mongoose.isValidObjectId(unverifiedCartId)) throw new Http_Errors.InvalidField("cart id");
    // Verify that the cart belongs to the buyer
    if (!buyer.carts.length) throw new Http_Errors.Unauthorized("Buyer", "cart");

    // Retrieve the cart
    let verifiedCart: CartItem | null = null;
    if (!isCartItem(buyer.carts[0])) throw new Error("Cart item is not a valid CartItem");
    else verifiedCart = buyer.carts[0] as CartItem;

    // Part 3: Validate the existance of the provided field
    if (!items) throw new Http_Errors.MissingField();

    // Part 4: items verification
    const verifiedVendor = await VendorModel.findById(verifiedCart.vendorId).select("menu").exec();
    if (!verifiedVendor) throw new Http_Errors.NotFound("Vendor");
    const uniqueItems = new Set();
    items.forEach(({ item, quantity }) => {
      // Verify validity of each item and its ownership to the vendor
      if (!mongoose.isValidObjectId(item)) throw new Http_Errors.InvalidField("item id");
      const verifiedItemId = new mongoose.Types.ObjectId(item);
      const index = verifiedVendor.menu.indexOf(verifiedItemId);
      if (index === -1) throw new Http_Errors.Unauthorized("Vendor", "item");

      // Verify that there are no duplicate items
      if (uniqueItems.has(item))
        throw new Http_Errors.CustomError("Duplicate items are not allowed", 400);
      uniqueItems.add(item);

      // Verify the quantity of each item is not zero
      if (quantity <= 0) throw new Http_Errors.InvalidField("item quantity");
    });

    // Update the cart
    const updatedCart = await CartModel.findByIdAndUpdate(
      verifiedCart._id,
      {
        items: items,
      },
      { new: true, populate: { path: "vendorId items.item" } }
    ).exec();

    res.status(200).json(updatedCart);
  } catch (error) {
    next(error);
  }
};

/**
 * Either adds the specified item, updates the item's quantity, or removes the item for the cart.
 *  - Prerequisite:
 *    - Buyer's id must exist in session
 *    - The cart must belong to the buyer
 *    - All items must belong to the existing vendor
 *  - Params: cartId
 *  - Body: item - {item: Types.ObjectId, quantity: number}
 *  - Return: Cart
 */
export const updateItem: RequestHandler<CartParams, unknown, UpdateItemBody, unknown> = async (
  req,
  res,
  next
) => {
  const unverifiedCartId = req.params.cartId;
  const requestItem = req.body.item;
  try {
    // Part 1: Verify the validity of buyer profile
    assertIsDefined(req.session.buyerId);
    const buyer: Buyer | null = await BuyerModel.findById(req.session.buyerId)
      .populate({ path: "carts", match: { _id: unverifiedCartId } })
      .lean();
    if (!buyer) throw new Http_Errors.NotFound("Buyer");

    // Part 2: Verify the cart id and its ownership to the buyer
    // Verify the validity of the cart id
    if (!mongoose.isValidObjectId(unverifiedCartId)) throw new Http_Errors.InvalidField("cart id");
    // Verify that the cart belongs to the buyer
    if (!buyer.carts.length) throw new Http_Errors.Unauthorized("Buyer", "cart");

    // Retrieve the cart
    let verifiedCart: CartItem | null = null;
    if (!isCartItem(buyer.carts[0])) throw new Error("Cart item is not a valid CartItem");
    else verifiedCart = buyer.carts[0] as CartItem;

    // Part 3: Validate the existance of the provided field
    if (!requestItem) throw new Http_Errors.MissingField();
    const { item, quantity } = requestItem;
    if (quantity < 0) throw new Http_Errors.InvalidField("item quantity");

    // Part 4: item verification
    const verifiedVendor = await VendorModel.findById(verifiedCart.vendorId).select("menu").exec();
    if (!verifiedVendor) throw new Http_Errors.NotFound("Vendor");

    // Verify validity of the item and its ownership to the vendor
    if (!mongoose.isValidObjectId(item)) throw new Http_Errors.InvalidField("item id");
    const verifiedItemId = new mongoose.Types.ObjectId(item);
    const index = verifiedVendor.menu.indexOf(verifiedItemId);
    if (index === -1) throw new Http_Errors.Unauthorized("Vendor", "item");

    // Part 5: Update the cart
    let found = false;
    // The item exists in the cart, update the item's quantity
    let updatedItems = verifiedCart.items.map((cartItem) => {
      if (!isObjectId(cartItem.item)) throw new Error("item is not a valid ObjectId");
      if (cartItem.item.toString() === item) {
        found = true;
        // Update the item's quantity
        if (quantity !== 0) return { item: verifiedItemId, quantity: quantity };
        // Remove the item from the cart
        else return null;
      }
      return cartItem;
    });
    if (found) updatedItems = updatedItems.filter((item) => item !== null);

    // The item does not exist in the cart, add the item to the cart
    if (!found && quantity !== 0) updatedItems.push({ item: verifiedItemId, quantity: quantity });

    // Part 6: Send request to update the cart in the database
    const updatedCart = await CartModel.findByIdAndUpdate(
      verifiedCart._id,
      {
        items: updatedItems,
      },
      { new: true, populate: { path: "vendorId items.item" } }
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
    const buyer: Buyer | null = await BuyerModel.findById(req.session.buyerId)
      .populate({ path: "carts", match: { _id: unverifiedCartId } })
      .lean();
    if (!buyer) throw new Http_Errors.NotFound("Buyer");

    // Verify that the cart belongs to the buyer
    if (!buyer.carts.length) throw new Http_Errors.Unauthorized("Buyer", "cart");

    // Retrieve the cart
    let verifiedCart: CartItem | null = null;
    if (!isCartItem(buyer.carts[0])) throw new Error("Cart item is not a valid CartItem");
    else verifiedCart = buyer.carts[0] as CartItem;

    // Toggle the savedForLater field of the cart
    const updatedCart = await CartModel.findByIdAndUpdate(
      verifiedCart._id,
      { savedForLater: !verifiedCart.savedForLater },
      { new: true, populate: { path: "vendorId items.item" } }
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
