import express from "express";
import * as CartsController from "../../controllers/items/carts";

// Create the router for the server
const router = express.Router();

router.get("/", CartsController.getCarts);
router.get("/cart/:cartId", CartsController.getCart);
router.post("/cart", CartsController.createCart);
// router.put("/:cartId", CartsController.updateCart);
// router.patch("/:cartId", CartsController.toggleSaveForLater);
// router.delete("/", CartsController.emptyCarts);
router.delete("/cart/:cartId", CartsController.emptyCart);

export default router;
