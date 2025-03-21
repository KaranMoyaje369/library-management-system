import {
  isAuthenticated,
  isAuthorized,
} from "../middlewares/authMiddleware.js"; // Import authentication and authorization middlewares
import {
  addBook,
  deleteBook,
  getAllBooks,
} from "../controllers/bookController.js"; // Import controller functions

import express from "express"; // Import Express.js

// Create an Express router
const router = express.Router();

// Route for adding a new book (requires authentication and admin authorization)
router.post("/admin/add", isAuthenticated, isAuthorized("Admin"), addBook);

// Route for retrieving all books (requires authentication)
router.get("/all", isAuthenticated, getAllBooks);

// Route for deleting a book (requires authentication and admin authorization)
router.delete(
  "/delete/:id",
  isAuthenticated,
  isAuthorized("Admin"),
  deleteBook
);

// Export the router
export default router;
