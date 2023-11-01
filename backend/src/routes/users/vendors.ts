import express from "express";
import * as VendorsController from "../../controllers/users/vendors";
import { requiresAuth, requiresVendor } from "../../middleware/auth";

// Create the router for the server
const router = express.Router();

router.get("/", requiresVendor, VendorsController.getProfile);
router.post("/", requiresAuth, VendorsController.createProfile);
router.patch("/", requiresVendor, VendorsController.updateProfile);
router.patch("/cuisine", requiresVendor, VendorsController.updatedCuisine);

router.get("/menu", requiresVendor, VendorsController.getMenu);
router.patch("/menu", requiresVendor, VendorsController.updateMenu);

export default router;
