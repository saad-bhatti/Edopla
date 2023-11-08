import express from "express";
import * as BuyersController from "../../controllers/users/buyers";
import { requiresAuth, requiresBuyer } from "../../middleware/auth";

/** Router for all buyer-related endpoints. */
const router = express.Router();

router.get("/", requiresBuyer, BuyersController.getBuyer);
router.post("/", requiresAuth, BuyersController.createBuyer);
router.patch("/", requiresBuyer, BuyersController.updateBuyer);

router.get("/savedVendors", requiresBuyer, BuyersController.getSavedVendors);
router.patch("/savedVendor", requiresBuyer, BuyersController.toggleSavedVendor);

export default router;
