import { RequestHandler } from "express";
import createHttpError from "http-errors";
import mongoose from "mongoose";
import OrderModel from "../../models/items/orderItem";
import VendorModel from "../../models/users/vendor";
import { assertIsDefined } from "../../util/assertIsDefined";

/** Retrieve all orders of the specified vendor from the database. */
export const getOrders: RequestHandler = async (req, res, next) => {
  try {
    // Verify the validity of vendor profile
    assertIsDefined(req.session.vendorId);
    const vendor = await VendorModel.findById(req.session.vendorId).populate("orders").exec();
    if (!vendor) throw createHttpError(404, "Vendor profile not found");

    res.status(200).json(vendor.orders);
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieve an order specified by its id from the database.
 * Note that the order must belong to the vendor.
 */
export const getOrder: RequestHandler = async (req, res, next) => {
  try {
    // Verify the validity of vendor profile
    assertIsDefined(req.session.vendorId);
    const vendor = await VendorModel.findById(req.session.vendorId).exec();
    if (!vendor) throw createHttpError(404, "Vendor profile not found");

    // Verify the validity of order id
    const unverifiedOrderId = req.params.orderId;
    if (!mongoose.isValidObjectId(unverifiedOrderId))
      throw createHttpError(400, "Invalid order id");
    const verifiedOrder = await OrderModel.findById(unverifiedOrderId).exec();
    if (!verifiedOrder) throw createHttpError(404, "Menu item not found");

    // TODO

    res.status(200).json(vendor.orders);
  } catch (error) {
    next(error);
  }
};
