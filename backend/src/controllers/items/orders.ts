import { RequestHandler } from "express";
import createHttpError from "http-errors";
import mongoose from "mongoose";
import CartModel from "../../models/items/cartItem";
import OrderModel from "../../models/items/orderItem";
import BuyerModel from "../../models/users/buyer";
import VendorModel from "../../models/users/vendor";
import { assertIsDefined } from "../../util/assertIsDefined";
import * as Interfaces from "../../util/interfaces";

/** "Type" of the HTTP request parameters when interacting with an order */
interface OrderParams {
  orderId?: string;
}

/** "Type" of the HTTP request body when creating a cart */
interface OrderBody {
  cartId?: string;
}

/** "Type" of the HTTP request body when processing an order */
interface ProcessOrderBody {
  isAccept?: boolean;
}

/** "Type" of the HTTP request body when updating an order's status */
interface StatusOrderBody {
  status?: number;
}

/* Buyer-Related Requests */
/**
 * Retrieve all orders of the buyer from the database.
 * Prerequisite: Buyer's id must exist in session.
 */
export const getBuyerOrders: RequestHandler<unknown, unknown, unknown, unknown> = async (
  req,
  res,
  next
) => {
  try {
    // Verify the validity of buyer profile
    assertIsDefined(req.session.buyerId);
    const buyer = await BuyerModel.findById(req.session.buyerId)
      .populate({
        path: "orders",
        populate: {
          path: "cartId",
          model: "CartItem",
        },
      })
      .exec();
    if (!buyer) throw createHttpError(404, "Buyer profile not found");

    res.status(200).json(buyer.orders);
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieve an order specified by its id from the database.
 * Prerequisites:
 *  - Buyer's id must exist in session
 *  - The order must belong to the buyer
 */
export const getBuyerOrder: RequestHandler<OrderParams, unknown, unknown, unknown> = async (
  req,
  res,
  next
) => {
  const unverifiedOrderId = req.params.orderId;
  try {
    // Verify the validity of the order id
    if (!mongoose.isValidObjectId(unverifiedOrderId))
      throw createHttpError(400, "Invalid order id: " + unverifiedOrderId);

    // Verify the validity of buyer profile
    assertIsDefined(req.session.buyerId);
    const buyer = await BuyerModel.findById(req.session.buyerId)
      .populate({
        path: "orders",
        match: { _id: unverifiedOrderId },
        populate: { path: "cartId", model: "CartItem" },
      })
      .exec();
    if (!buyer) throw createHttpError(404, "Buyer profile not found");

    // Verify that the order belongs to the buyer
    if (!buyer.orders.length)
      throw createHttpError(403, "Order id '" + unverifiedOrderId + "' is not owned by the buyer");
    const verifiedOrder = buyer.orders[0];

    res.status(200).json(verifiedOrder);
  } catch (error) {
    next(error);
  }
};

/**
 * Place an order for the buyer.
 * Prerequisites:
 *  - Buyer's id must exist in session
 *  - The cart must belong to the buyer
 */
export const placeOrder: RequestHandler<unknown, unknown, OrderBody, unknown> = async (
  req,
  res,
  next
) => {
  const unverifiedCartId = req.body.cartId;
  try {
    // Verify the validity of the cart id
    if (!mongoose.isValidObjectId(unverifiedCartId))
      throw createHttpError(400, "Invalid cart id: " + unverifiedCartId);

    // Verify the validity of buyer profile
    assertIsDefined(req.session.buyerId);
    const buyer: Interfaces.B_CP2 | null = await BuyerModel.findById(req.session.buyerId)
      .populate({
        path: "carts",
        match: { _id: unverifiedCartId },
        populate: { path: "items", model: "MenuItem" },
      })
      .lean();
    if (!buyer) throw createHttpError(404, "Buyer profile not found");

    // Verify that the cart belongs to the buyer & retrieve the necessary data
    if (!buyer.carts.length)
      throw createHttpError(403, "Cart id '" + unverifiedCartId + "' is not owned by the buyer");
    const verifiedCart: Interfaces.CI_IP = buyer.carts[0];
    const itemsMap = verifiedCart.items;
    const itemsQuantityObject = verifiedCart.itemsQuantity;
    const itemsQuantityMap = new Map(Object.entries(itemsQuantityObject));
    /* Note that the mongoose request actually returns the itemsQuantity field
       as type Object rather than type Map (as seen in this post facing a similar
       problem: https://github.com/Automattic/mongoose/issues/9564). This is a
       workaround the problem. */

    // Calculate the total price of the cart
    let totalPrice = 0;
    for (const key of itemsMap.keys()) {
      const item = itemsMap.get(key)!;
      const quantity = itemsQuantityMap.get(key)!;
      totalPrice += item.price * quantity;
    }

    /* Create the order in the database, add it to the buyer's orders, and remove
       the cart from the buyer's carts */
    const newOrder = await OrderModel.create({
      buyerId: buyer._id,
      cartId: verifiedCart._id,
      totalPrice: totalPrice,
      date: new Date(),
      status: 0,
    });
    await BuyerModel.findByIdAndUpdate(buyer._id, {
      $push: { orders: newOrder._id },
      $pull: { carts: verifiedCart._id },
    }).exec();

    res.status(201).json(newOrder);
  } catch (error) {
    next(error);
  }
};

/**
 * Cancel an order for the buyer.
 * Prerequisites:
 *  - Buyer's id must exist in session
 *  - The order must belong to the buyer
 *  - The order must be in the "pending" status (status 0)
 */
export const cancelOrder: RequestHandler<OrderParams, unknown, unknown, unknown> = async (
  req,
  res,
  next
) => {
  const unverifiedOrderId = req.params.orderId;
  try {
    // Verify the validity of the order id
    if (!mongoose.isValidObjectId(unverifiedOrderId))
      throw createHttpError(400, "Invalid order id: " + unverifiedOrderId);

    // Verify the validity of buyer profile
    assertIsDefined(req.session.buyerId);
    const buyer: Interfaces.B_OP1 | null = await BuyerModel.findById(req.session.buyerId)
      .populate({
        path: "orders",
        match: { _id: unverifiedOrderId },
      })
      .lean();
    if (!buyer) throw createHttpError(404, "Buyer profile not found");

    // Verify that the order belongs to the buyer
    if (!buyer.orders.length)
      throw createHttpError(403, "Order id '" + unverifiedOrderId + "' is not owned by the buyer");
    const verifiedOrder: Interfaces.OI_U = buyer.orders[0];

    // Verify that the order is in the "pending" status
    if (verifiedOrder.status !== 0)
      throw createHttpError(403, "Order id '" + verifiedOrder._id + "' is not in 'pending' status");

    // Remove the order from the buyer's orders and delete the cart & order from the database
    await BuyerModel.findByIdAndUpdate(buyer._id, {
      $pull: { orders: verifiedOrder._id },
    }).exec();
    await CartModel.findByIdAndDelete(verifiedOrder.cartId).exec();
    await OrderModel.findByIdAndDelete(verifiedOrder._id).exec();

    res.status(200).json({ message: "Order cancelled successfully" });
  } catch (error) {
    next(error);
  }
};

/* Vendor-Related Requests */
/**
 * Retrieve all orders of the vendor from the database.
 * Prerequisite: Vendor's id must exist in session.
 */
export const getVendorOrders: RequestHandler<unknown, unknown, unknown, unknown> = async (
  req,
  res,
  next
) => {
  try {
    // Verify the validity of vendor profile
    assertIsDefined(req.session.vendorId);
    const vendor = await VendorModel.findById(req.session.vendorId)
      .populate({
        path: "orders",
        populate: {
          path: "cartId",
          model: "CartItem",
        },
      })
      .exec();
    if (!vendor) throw createHttpError(404, "Vendor profile not found");

    res.status(200).json(vendor.orders);
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieve an order specified by its id from the database.
 * Prerequisites:
 *  - Vendor's id must exist in session
 *  - The order must belong to the vendor
 */
export const getVendorOrder: RequestHandler<OrderParams, unknown, unknown, unknown> = async (
  req,
  res,
  next
) => {
  const unverifiedOrderId = req.params.orderId;
  try {
    // Verify the validity of the order id
    if (!mongoose.isValidObjectId(unverifiedOrderId))
      throw createHttpError(400, "Invalid order id: " + unverifiedOrderId);

    // Verify the validity of vendor profile
    assertIsDefined(req.session.vendorId);
    const vendor = await VendorModel.findById(req.session.vendorId)
      .populate({
        path: "orders",
        match: { _id: unverifiedOrderId },
        populate: { path: "cartId", model: "CartItem" },
      })
      .exec();
    if (!vendor) throw createHttpError(404, "Vendor profile not found");

    // Verify that the order belongs to the buyer
    if (!vendor.orders.length)
      throw createHttpError(403, "The order does not belong to the vendor");
    const verifiedOrder = vendor.orders[0];

    res.status(200).json(verifiedOrder);
  } catch (error) {
    next(error);
  }
};

/**
 * Process an order from the buyer by either accepting or rejecting it.
 * Prerequisites:
 *  - Vendor's id must exist in session
 *  - The order must belong to the vendor
 *  - The order must be in the "pending" status (status 0)
 */
export const processOrder: RequestHandler<OrderParams, unknown, ProcessOrderBody, unknown> = async (
  req,
  res,
  next
) => {
  const unverifiedOrderId = req.params.orderId;
  const isAccepted = req.body.isAccept;
  try {
    // Verify the validity of vendor profile
    assertIsDefined(req.session.vendorId);
    const vendor = await VendorModel.findById(req.session.vendorId);
    if (!vendor) throw createHttpError(404, "Vendor profile not found");

    // Verify the existance of the required field
    if (isAccepted === undefined) throw createHttpError(400, "Missing required field: isAccepted");

    // Verify the validity of the order id and retrieve the order
    if (!mongoose.isValidObjectId(unverifiedOrderId))
      throw createHttpError(400, "Invalid order id: " + unverifiedOrderId);
    const verifiedOrder: Interfaces.OI_CP | null = await OrderModel.findById(unverifiedOrderId)
      .populate({ path: "cartId", select: "vendorId" })
      .lean();
    if (!verifiedOrder) throw createHttpError(404, "Order not found");

    // Verify that the order (from the cart) belongs to the vendor
    if (!vendor._id.equals(verifiedOrder.cartId.vendorId))
      throw createHttpError(403, "The order does not belong to this vendor");

    // Verify the order status is pending
    if (verifiedOrder.status !== 0) throw createHttpError(403, "The order's status is not pending");

    // If accepting the order, update the order status to in-progress & add it to the vendor's orders
    if (isAccepted) {
      await OrderModel.findByIdAndUpdate(verifiedOrder._id, { status: 1 }).exec();
      await VendorModel.findByIdAndUpdate(vendor._id, {
        $push: { orders: verifiedOrder._id },
      }).exec();
    }
    // Otherwise, mark the order as cancelled
    else await OrderModel.findByIdAndUpdate(verifiedOrder._id, { status: 4 }).exec();

    res.status(200).json({ message: "Order processed successfully" });
  } catch (error) {
    next(error);
  }
};

/**
 * Update the status of the specified order.
 * Prerequisites:
 *  - Vendor's id must exist in session
 *  - The order must belong to the vendor
 *  - The new status must be greater than the current status
 */
export const updateOrderStatus: RequestHandler<
  OrderParams,
  unknown,
  StatusOrderBody,
  unknown
> = async (req, res, next) => {
  const unverifiedOrderId = req.params.orderId;
  const status = req.body.status;
  try {
    // Verify the existance of the required field
    if (!status) throw createHttpError(400, "A required field is missing");

    // Verify the validity of the order id and retrieve the order
    if (!mongoose.isValidObjectId(unverifiedOrderId))
      throw createHttpError(400, "Invalid order id: " + unverifiedOrderId);

    // Verify the validity of vendor profile
    assertIsDefined(req.session.vendorId);
    const vendor: Interfaces.V_OP1 | null = await VendorModel.findById(req.session.vendorId)
      .populate({
        path: "orders",
        match: { _id: unverifiedOrderId },
      })
      .lean();
    if (!vendor) throw createHttpError(404, "Vendor profile not found");

    if (!vendor.orders.length)
      throw createHttpError(403, "The order does not belong to the vendor");
    const verifiedOrder: Interfaces.OI_U = vendor.orders[0];

    // Verify the current order status is less than the new status
    if (verifiedOrder.status >= status)
      throw createHttpError(403, "Invalid update to order status");

    // Update the order status
    const updatedOrder = await OrderModel.findByIdAndUpdate(
      verifiedOrder._id,
      { status: status },
      { new: true }
    ).exec();

    res.status(200).json(updatedOrder);
  } catch (error) {
    next(error);
  }
};
