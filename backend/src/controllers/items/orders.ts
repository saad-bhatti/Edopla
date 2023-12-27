import { RequestHandler } from "express";
import mongoose from "mongoose";
import * as Http_Errors from "../../errors/http_errors";
import CartModel from "../../models/items/cartItem";
import OrderModel from "../../models/items/orderItem";
import BuyerModel from "../../models/users/buyer";
import VendorModel from "../../models/users/vendor";
import { assertIsDefined } from "../../util/assertIsDefined";
import * as Interfaces from "../../util/interfaces";

/** "Type" of the HTTP request parameters when interacting with an order. */
interface OrderParams {
  orderId?: string;
}

/** "Type" of the HTTP request body when creating a cart. */
interface OrderBody {
  cartId?: string;
}

/** "Type" of the HTTP request body when processing an order. */
interface ProcessOrderBody {
  isAccept?: boolean;
}

/** "Type" of the HTTP request body when updating an order's status. */
interface StatusOrderBody {
  status?: number;
}

/**
 * Retrieve all orders of the buyer from the database.
 *  - Prerequisite: Buyer's id must exist in session.
 *  - Params: None
 *  - Body: None
 *  - Return: [OrderItem]
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
    if (!buyer) throw new Http_Errors.NotFound("Buyer");

    res.status(200).json(buyer.orders);
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieve an order specified by its id from the database.
 *  - Prerequisites:
 *    - Buyer's id must exist in session
 *    - The order must belong to the buyer
 *  - Params: orderId
 *  - Body: None
 *  - Return: OrderItem
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
      throw new Http_Errors.InvalidField("order id");

    // Verify the validity of buyer profile
    assertIsDefined(req.session.buyerId);
    const buyer = await BuyerModel.findById(req.session.buyerId)
      .populate({
        path: "orders",
        match: { _id: unverifiedOrderId },
        populate: { path: "cartId", model: "CartItem" },
      })
      .exec();
    if (!buyer) throw new Http_Errors.NotFound("Buyer");

    // Verify that the order belongs to the buyer
    if (!buyer.orders.length) throw new Http_Errors.Unauthorized("Buyer", "order");
    const verifiedOrder = buyer.orders[0];

    res.status(200).json(verifiedOrder);
  } catch (error) {
    next(error);
  }
};

/**
 * Place an order for the buyer.
 *  - Prerequisites:
 *    - Buyer's id must exist in session
 *    - The cart must belong to the buyer
 *  - Params: None
 *  - Body: cartId
 *  - Return: OrderItem
 */
export const placeOrder: RequestHandler<unknown, unknown, OrderBody, unknown> = async (
  req,
  res,
  next
) => {
  const unverifiedCartId = req.body.cartId;
  try {
    // Verify the validity of the cart id
    if (!mongoose.isValidObjectId(unverifiedCartId)) throw new Http_Errors.InvalidField("cart id");

    // Verify the validity of buyer profile
    assertIsDefined(req.session.buyerId);
    const buyer: Interfaces.B_CP2 | null = await BuyerModel.findById(req.session.buyerId)
      .populate({
        path: "carts",
        match: { _id: unverifiedCartId },
        populate: { path: "items.item", model: "MenuItem" },
      })
      .lean();
    if (!buyer) throw new Http_Errors.NotFound("Buyer");

    // Verify that the cart belongs to the buyer & retrieve the necessary data
    if (!buyer.carts.length) throw new Http_Errors.Unauthorized("Buyer", "cart");
    const verifiedCart: Interfaces.CI_IP = buyer.carts[0];
    const items = verifiedCart.items;

    // Calculate the total price of the cart
    let totalPrice = 0;
    for (const { item, quantity } of items) totalPrice += item.price * quantity;

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
 *  - Prerequisites:
 *    - Buyer's id must exist in session
 *    - The order must belong to the buyer
 *    - The order must be in the "pending" status (status 0)
 *  - Params: orderId
 *  - Body: None
 *  - Return: String
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
      throw new Http_Errors.InvalidField("order id");

    // Verify the validity of buyer profile
    assertIsDefined(req.session.buyerId);
    const buyer: Interfaces.B_OP1 | null = await BuyerModel.findById(req.session.buyerId)
      .populate({
        path: "orders",
        match: { _id: unverifiedOrderId },
      })
      .lean();
    if (!buyer) throw new Http_Errors.NotFound("Buyer");

    // Verify that the order belongs to the buyer
    if (!buyer.orders.length) throw new Http_Errors.Unauthorized("Buyer", "order");
    const verifiedOrder: Interfaces.OI_U = buyer.orders[0];

    // Verify that the order is in the "pending" status
    if (verifiedOrder.status !== 0)
      throw new Http_Errors.CustomError("Order is not in 'pending' status", 403);

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
 *  - Prerequisite: Vendor's id must exist in session.
 *  - Params: None
 *  - Body: None
 *  - Return: [OrderItem]
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
    if (!vendor) throw new Http_Errors.NotFound("Vendor");

    res.status(200).json(vendor.orders);
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieve an order specified by its id from the database.
 *  - Prerequisites:
 *    - Vendor's id must exist in session
 *    - The order must belong to the vendor
 *  - Params: orderId
 *  - Body: None
 *  - Return: OrderItem
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
      throw new Http_Errors.InvalidField("order id");

    // Verify the validity of vendor profile
    assertIsDefined(req.session.vendorId);
    const vendor = await VendorModel.findById(req.session.vendorId)
      .populate({
        path: "orders",
        match: { _id: unverifiedOrderId },
        populate: { path: "cartId", model: "CartItem" },
      })
      .exec();
    if (!vendor) throw new Http_Errors.NotFound("Vendor");

    // Verify that the order belongs to the buyer
    if (!vendor.orders.length) throw new Http_Errors.Unauthorized("Vendor", "order");
    const verifiedOrder = vendor.orders[0];

    res.status(200).json(verifiedOrder);
  } catch (error) {
    next(error);
  }
};

/**
 * Process an order from the buyer by either accepting or rejecting it.
 *  - Prerequisites:
 *    - Vendor's id must exist in session
 *    - The order must belong to the vendor
 *    - The order must be in the "pending" status (status 0)
 *  - Params: orderId
 *  - Body: isAccept
 *  - Return: String
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
    if (!vendor) throw new Http_Errors.NotFound("Vendor");

    // Verify the existance of the required field
    if (isAccepted === undefined) throw new Http_Errors.MissingField();

    // Verify the validity of the order id and retrieve the order
    if (!mongoose.isValidObjectId(unverifiedOrderId))
      throw new Http_Errors.InvalidField("order id");
    const verifiedOrder: Interfaces.OI_CP | null = await OrderModel.findById(unverifiedOrderId)
      .populate({ path: "cartId", select: "vendorId" })
      .lean();
    if (!verifiedOrder) throw new Http_Errors.NotFound("Order");

    // Verify that the order (from the cart) belongs to the vendor
    if (!vendor._id.equals(verifiedOrder.cartId.vendorId))
      throw new Http_Errors.Unauthorized("Vendor", "order");

    // Verify the order status is pending
    if (verifiedOrder.status !== 0)
      throw new Http_Errors.CustomError("Order is not in 'pending' status", 403);

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
 *  - Prerequisites:
 *    - Vendor's id must exist in session
 *    - The order must belong to the vendor
 *    - The new status must be greater than the current status
 *  - Params: orderId
 *  - Body: status
 *  - Return: OrderItem
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
    if (!status) throw new Http_Errors.MissingField();

    // Verify the validity of the order id and retrieve the order
    if (!mongoose.isValidObjectId(unverifiedOrderId))
      throw new Http_Errors.InvalidField("order id");

    // Verify the validity of vendor profile
    assertIsDefined(req.session.vendorId);
    const vendor: Interfaces.V_OP1 | null = await VendorModel.findById(req.session.vendorId)
      .populate({
        path: "orders",
        match: { _id: unverifiedOrderId },
      })
      .lean();
    if (!vendor) throw new Http_Errors.NotFound("Vendor");

    if (!vendor.orders.length) throw new Http_Errors.Unauthorized("Vendor", "order");
    const verifiedOrder: Interfaces.OI_U = vendor.orders[0];

    // Verify the current order status is less than the new status
    if (verifiedOrder.status >= status) throw new Http_Errors.InvalidField("order status");

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
