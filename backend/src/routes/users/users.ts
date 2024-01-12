import express from "express";
import * as UsersController from "../../controllers/users/users";
import { requiresAuth } from "../../middleware/auth";

/** Router for all user-related endpoints. */
const router = express.Router();

// Routing for retrieving an authenticated user
router.get("/", requiresAuth, UsersController.getAuthenticatedUser);

// Routing for signing up, logging in, logging out
router.post("/authenticate/form", UsersController.authenticationForm);
router.post("/authenticate/google", UsersController.authenticationGoogle);
router.post("/authenticate/github", UsersController.authenticateGitHub);
router.post("/logout", requiresAuth, UsersController.logOut);

export default router;
