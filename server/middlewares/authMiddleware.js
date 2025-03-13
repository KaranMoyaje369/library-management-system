import { User } from "../models/userModel.js"; // Import User model
import { catchAsyncErrors } from "./catchAsyncErrors.js"; // Import async error handler
import ErrorHandler from "./errorMiddleware.js"; // Import error handler
import jwt from "jsonwebtoken"; // Import JWT for token verification

// Middleware to check if the user is authenticated
export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies; // Extract the token from cookies

  // Check if the token exists
  if (!token) {
    return next(new ErrorHandler("User is not authenticated.", 400));
  }

  // Verify the token and decode its payload
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  // Find the user by ID from the decoded token and attach it to the request object
  req.user = await User.findById(decoded.id);

  // Proceed to the next middleware or route handler
  next();
});

// Middleware to check if the user is authorized (has the required role)
export const isAuthorized = (...roles) => {
  return (req, res, next) => {
    // Check if the user's role is included in the allowed roles
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `User with this role (${req.user.role}) not allowed to access this resource.`,
          400
        )
      );
    }

    // Proceed to the next middleware or route handler
    next();
  };
};
