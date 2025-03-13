import express from "express";
import {
  forgetPassword,
  getUser,
  login,
  logout,
  register,
  resetPassword,
  updatePassword,
  verifyOTP,
} from "../controllers/authController.js"; // Import controller functions
import { isAuthenticated } from "../middlewares/authMiddleware.js"; // Import authentication middleware

// Create an Express router
const router = express.Router();

// Route for user registration
router.post(
  "library-management-system-backend-gilt.vercel.app/register",
  register
);

// Route for verifying OTP (One-Time Password)
router.post(
  "library-management-system-backend-gilt.vercel.app/verify-otp",
  verifyOTP
);

// Route for user login
router.post("library-management-system-backend-gilt.vercel.app/login", login);

// Route for user logout (requires authentication)
router.get(
  "library-management-system-backend-gilt.vercel.app/logout",
  isAuthenticated,
  logout
);

// Route to get the currently logged-in user's details (requires authentication)
router.get(
  "library-management-system-backend-gilt.vercel.app/me",
  isAuthenticated,
  getUser
);

// Route for handling forgot password requests
router.post(
  "library-management-system-backend-gilt.vercel.app/password/forget",
  forgetPassword
);

// Route for resetting the user's password (requires a valid reset token)
router.put(
  "library-management-system-backend-gilt.vercel.app/password/reset/:token",
  resetPassword
);

// Route for updating the user's password (requires authentication)
router.put(
  "library-management-system-backend-gilt.vercel.app/password/update",
  isAuthenticated,
  updatePassword
);

// Export the router
export default router;
