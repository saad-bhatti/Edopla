import express from "express";
import * as CartsController from "../../controllers/items/carts";

/** Router for all cart-related endpoints. */
const router = express.Router();

router.get("/", CartsController.getCarts);
router.get("/:cartId", CartsController.getCart);
router.post("/", CartsController.createCart);
router.patch("/:cartId", CartsController.updateCart);
router.patch("/:cartId/item", CartsController.updateItem);
router.patch("/:cartId/savedForLater", CartsController.toggleSaveForLater);
router.delete("/", CartsController.emptyCarts);
router.delete("/:cartId", CartsController.emptyCart);

export default router;
