import express from "express";
import * as VendorOrdersController from "../../controllers/orders/vendorOrders";

// Create the router for the server
const router = express.Router();

router.get("/", VendorOrdersController.getOrders);
router.get("/:orderId", VendorOrdersController.getOrder);
// router.patch("/:orderId/status", VendorOrdersController.updateOrderStatus);

export default router;