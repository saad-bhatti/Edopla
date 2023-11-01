import express from "express";
import * as MenuItemsController from "../controllers/menuItems";
import { requiresVendor } from "../middleware/auth";

// Create the router for the server
const router = express.Router();

router.get("/:menuItemId", MenuItemsController.getMentItem);
router.post("/", requiresVendor, MenuItemsController.createMenuItem);
router.patch("/:menuItemId", requiresVendor, MenuItemsController.updateMenuItem);
router.patch(
  "/:menuItemId/available",
  requiresVendor,
  MenuItemsController.toggleMenuItemAvailability
);
router.delete("/:menuItemId", requiresVendor, MenuItemsController.deleteMenuItem);

export default router;
