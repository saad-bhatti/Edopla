import { requiresBuyer, requiresVendor } from "./../../middleware/auth";
import express from "express";
import * as OrdersController from "../../controllers/items/orders";

/** Router for all order-related endpoints. */
const router = express.Router();

router.get("/buyer", requiresBuyer, OrdersController.getBuyerOrders);
router.get("/buyer/:orderId", requiresBuyer, OrdersController.getBuyerOrder);
router.post("/buyer", requiresBuyer, OrdersController.placeOrder);
router.patch("/buyer/:orderId/cancel", requiresBuyer, OrdersController.cancelOrder);

router.get("/vendor", requiresVendor, OrdersController.getVendorOrders);
router.get("/vendor/:orderId", requiresVendor, OrdersController.getVendorOrder);
router.patch("/vendor/:orderId/process", requiresVendor, OrdersController.processOrder);
router.patch("/vendor/:orderId/status", requiresVendor, OrdersController.updateOrderStatus);

export default router;
