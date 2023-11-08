import express from "express";
import * as MenuItemsController from "../../controllers/items/menus";
import { requiresVendor } from "../../middleware/auth";

/** Router for all menu-related endpoints. */
const router = express.Router();

router.get("/:vendorId", MenuItemsController.getMenu);
router.get("/item/:menuItemId", MenuItemsController.getMenuItem);
router.post("/item/", requiresVendor, MenuItemsController.createMenuItem);
router.patch("/item/:menuItemId", requiresVendor, MenuItemsController.updateMenuItem);
router.patch(
  "/item/:menuItemId/availability",
  requiresVendor,
  MenuItemsController.toggleAvailability
);
router.delete("/item/:menuItemId", requiresVendor, MenuItemsController.deleteMenuItem);

export default router;
