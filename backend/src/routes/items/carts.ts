import express from "express";
import * as CartsController from "../../controllers/items/carts";

// Create the router for the server
const router = express.Router();

router.get("/", CartsController.getCarts);
router.get("/:cartId", CartsController.getCart);
router.post("/", CartsController.createCart);
router.patch("/:cartId/items", CartsController.updateCart);
router.patch("/:cartId/savedForLater", CartsController.toggleSaveForLater);
router.delete("/", CartsController.emptyCarts);
router.delete("/:cartId", CartsController.emptyCart);

export default router;
