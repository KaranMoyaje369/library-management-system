import express from "express"; // Import Express.js
import {
  borrowedBooks,
  recordBorrowedBook,
  getBorrowedBooksForAdmin,
  returnBorrowBook,
} from "../controllers/borrowController.js"; // Import controller functions
import {
  isAuthenticated,
  isAuthorized,
} from "../middlewares/authMiddleware.js"; // Import authentication and authorization middlewares

// Create an Express router
const router = express.Router();

// Route for recording a borrowed book (requires authentication)
router.post(
  "library-management-system-backend-gilt.vercel.app/record-borrow-book/:id",
  isAuthenticated,
  // isAuthorized("Admin"), // Uncomment if only admins should record borrowed books
  recordBorrowedBook
);

// Route for retrieving all borrowed books (requires authentication and admin authorization)
router.get(
  "library-management-system-backend-gilt.vercel.app/borrowed-books-by-users",
  isAuthenticated,
  isAuthorized("Admin"),
  getBorrowedBooksForAdmin
);

// Route for retrieving borrowed books for the logged-in user (requires authentication)
router.get(
  "library-management-system-backend-gilt.vercel.app/my-borrowed-books",
  isAuthenticated,
  borrowedBooks
);

// Route for returning a borrowed book (requires authentication)
router.put(
  "library-management-system-backend-gilt.vercel.app/return-borrowed-book/:bookId",
  isAuthenticated,
  //isAuthorized("Admin"), // Uncomment if only admins should handle returns
  returnBorrowBook
);

// Export the router
export default router;
