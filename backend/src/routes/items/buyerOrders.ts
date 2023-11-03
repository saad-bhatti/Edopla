import express from "express";
import * as BuyerOrdersController from "../../controllers/items/buyerOrders";

// Create the router for the server
const router = express.Router();

router.get("/", BuyerOrdersController.getOrders);
router.get("/:orderId", BuyerOrdersController.getOrder);
// router.post("/", BuyerOrdersController.placeOrder);
// router.patch("/:orderId/items", BuyerOrdersController.updateOrder);
// router.patch("/:orderId/cancel", BuyerOrdersController.cancelOrder);

export default router;
