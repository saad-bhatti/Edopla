import express from "express";
import * as BuyersController from "../../controllers/users/buyers";
import { requiresAuth, requiresBuyer } from "../../middleware/auth";

// Create the router for the server
const router = express.Router();

router.get("/", requiresBuyer, BuyersController.getBuyer);
router.post("/", requiresAuth, BuyersController.createBuyer);
router.patch("/", requiresBuyer, BuyersController.updateBuyer);

router.get("/savedVendors", requiresBuyer, BuyersController.getSavedVendors);
router.patch("/savedVendor", requiresBuyer, BuyersController.updateSavedVendor);

export default router;
