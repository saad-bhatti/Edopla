import express from "express";
import * as VendorsController from "../../controllers/users/vendors";
import { requiresAuth, requiresVendor } from "../../middleware/auth";

/** Router for all vendor-related endpoints. */
const router = express.Router();

router.get("/all", VendorsController.getAllVendors);
router.get("/", requiresVendor, VendorsController.getVendor);
router.post("/", requiresAuth, VendorsController.createVendor);
router.patch("/", requiresVendor, VendorsController.updateVendor);
router.patch("/cuisine", requiresVendor, VendorsController.toggleCuisine);

export default router;
