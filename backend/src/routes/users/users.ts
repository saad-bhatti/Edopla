import express from "express";
import * as UsersController from "../../controllers/users/users";
import { requiresAuth } from "../../middleware/auth";

/** Router for all user-related endpoints. */
const router = express.Router();

// Routing for retrieving an authenticated user
router.get("/", requiresAuth, UsersController.getAuthenticatedUser);

// Routing for signing up, logging in, logging out
router.post("/signup", UsersController.signUp);
router.post("/signup/google", UsersController.signUpGoogle);
router.post("/login", UsersController.login);
router.post("/login/google", UsersController.loginGoogle);
router.post("/logout", requiresAuth, UsersController.logout);

export default router;
