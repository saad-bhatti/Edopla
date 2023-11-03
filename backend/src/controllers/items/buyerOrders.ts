import { RequestHandler } from "express";
import createHttpError from "http-errors";
import mongoose from "mongoose";
import OrderModel from "../../models/items/orderItem";
import BuyerModel from "../../models/users/buyer";
import { assertIsDefined } from "../../util/assertIsDefined";

/** Retrieve all orders of the specified buyer from the database. */
export const getOrders: RequestHandler = async (req, res, next) => {
  try {
    // Verify the validity of buyer profile
    assertIsDefined(req.session.buyerId);
    const buyer = await BuyerModel.findById(req.session.buyerId).populate("orders").exec();
    if (!buyer) throw createHttpError(404, "Buyer profile not found");

    res.status(200).json(buyer.orders);
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieve an order specified by its id from the database.
 * Note that the order must belong to the buyer.
 */
export const getOrder: RequestHandler = async (req, res, next) => {
  try {
    // Verify the validity of buyer profile
    assertIsDefined(req.session.buyerId);
    const buyer = await BuyerModel.findById(req.session.buyerId).exec();
    if (!buyer) throw createHttpError(404, "Buyer profile not found");

    // Verify the validity of order id
    const unverifiedOrderId = req.params.orderId;
    if (!mongoose.isValidObjectId(unverifiedOrderId))
      throw createHttpError(400, "Invalid order id");
    const verifiedOrder = await OrderModel.findById(unverifiedOrderId).exec();
    if (!verifiedOrder) throw createHttpError(404, "Order not found");

    // Verify that the order belongs to the buyer
    const index = buyer.orders.indexOf(verifiedOrder._id);
    if (index === -1) throw createHttpError(403, "Order does not belong to buyer");

    res.status(200).json(verifiedOrder);
  } catch (error) {
    next(error);
  }
};
