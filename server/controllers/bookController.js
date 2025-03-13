import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js"; // Import async error handler
import { Book } from "../models/bookModel.js"; // Import Book model
import { User } from "../models/userModel.js"; // Import User model (not used in this file, can be removed)
import ErrorHandler from "../middlewares/errorMiddleware.js"; // Import error handler

// Add a new book
export const addBook = catchAsyncErrors(async (req, res, next) => {
  const { title, author, description, price, quantity } = req.body;

  // Check if all required fields are provided
  if (!title || !author || !description || !price || !quantity) {
    return next(new ErrorHandler("Please fill all fields.", 400));
  }

  // Create a new book in the database
  const book = await Book.create({
    title,
    author,
    description,
    price,
    quantity,
  });

  // Send success response with the created book
  res.status(200).json({
    success: true,
    message: "Book added successfully.",
    book,
  });
});

// Get all books
export const getAllBooks = catchAsyncErrors(async (req, res, next) => {
  // Retrieve all books from the database
  const books = await Book.find();

  // Send success response with the list of books
  res.status(200).json({
    success: true,
    books,
  });
});

// Delete a book
export const deleteBook = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  // Find the book by ID
  const book = await Book.findById(id);

  // Check if the book exists
  if (!book) {
    return next(new ErrorHandler("Book not found.", 404));
  }

  // Delete the book from the database
  await book.deleteOne();

  // Send success response
  res.status(200).json({
    success: true,
    message: "Book deleted successfully",
  });
});
