import express from "express"; // Import Express.js
import {
  getAllUsers,
  registerNewAdmin,
} from "../controllers/userController.js"; // Import controller functions
import {
  isAuthenticated,
  isAuthorized,
} from "../middlewares/authMiddleware.js"; // Import authentication and authorization middlewares

// Create an Express router
const router = express.Router();

// Route for retrieving all users (requires authentication and admin authorization)
router.get("/all", isAuthenticated, isAuthorized("Admin"), getAllUsers);

// Route for registering a new admin (requires authentication and admin authorization)
router.post(
  "/add/new-admin",
  isAuthenticated,
  isAuthorized("Admin"),
  registerNewAdmin
);

// Export the router
export default router;
