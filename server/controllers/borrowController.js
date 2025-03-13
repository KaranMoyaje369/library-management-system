import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js"; // Import async error handler
import ErrorHandler from "../middlewares/errorMiddleware.js"; // Import error handler
import { Book } from "../models/bookModel.js"; // Import Book model
import { Borrow } from "../models/borrowModel.js"; // Import Borrow model
import { User } from "../models/userModel.js"; // Import User model
import { calculateFine } from "../utils/fineCalculator.js"; // Import fine calculation utility

// Record a borrowed book
export const recordBorrowedBook = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params; // Book ID from URL parameters
  const { email } = req.body; // User email from request body

  // Find the book by ID
  const book = await Book.findById(id);
  if (!book) {
    return next(new ErrorHandler("Book not found.", 404));
  }

  // Find the user by email
  const user = await User.findOne({ email });
  if (!user) {
    return next(new ErrorHandler("User not found.", 404));
  }

  // Check if the book is available
  if (book.quantity === 0) {
    return next(new ErrorHandler("Book not available.", 404));
  }

  // Check if the user has already borrowed the book and not returned it
  const isAlreadyBorrowed = user.borrowedBooks.find(
    (b) => b.bookId.toString() === id && b.returned === false
  );
  if (isAlreadyBorrowed) {
    return next(new ErrorHandler("Book already borrowed.", 400));
  }

  // Update book quantity and availability
  book.quantity -= 1;
  book.availability = book.quantity > 0;
  await book.save();

  // Add the borrowed book to the user's borrowedBooks array
  user.borrowedBooks.push({
    bookId: book._id,
    bookTitle: book.title,
    borrowDate: new Date(),
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Due date is 7 days from now
  });
  await user.save();

  // Create a new Borrow record
  await Borrow.create({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
    book: book._id,
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Due date is 7 days from now
    price: book.price,
  });

  // Send success response
  res.status(200).json({
    success: true,
    message: "Borrowed book recorded successfully.",
  });
});

// Return a borrowed book
export const returnBorrowBook = catchAsyncErrors(async (req, res, next) => {
  const { bookId } = req.params; // Book ID from URL parameters
  const { email } = req.body; // User email from request body

  // Find the book by ID
  const book = await Book.findById(bookId);
  if (!book) {
    return next(new ErrorHandler("Book not found.", 404));
  }

  // Find the user by email
  const user = await User.findOne({ email, accountVerified: true });
  if (!user) {
    return next(new ErrorHandler("User not found.", 404));
  }

  // Find the borrowed book in the user's borrowedBooks array
  const borrowedBook = user.borrowedBooks.find(
    (b) => b.bookId.toString() === bookId && b.returned === false
  );
  if (!borrowedBook) {
    return next(new ErrorHandler("You have not borrowed this book.", 400));
  }

  // Mark the book as returned
  borrowedBook.returned = true;
  await user.save();

  // Update book quantity and availability
  book.quantity += 1;
  book.availability = book.quantity > 0;
  await book.save();

  // Find the Borrow record for the returned book
  const borrow = await Borrow.findOne({
    book: bookId,
    "user.email": email,
    returnDate: null,
  });
  if (!borrow) {
    return next(new ErrorHandler("You have not borrowed this book", 400));
  }

  // Update the Borrow record with the return date and fine
  borrow.returnDate = new Date();
  const fine = calculateFine(borrow.dueDate); // Calculate fine for late return
  borrow.fine = fine;
  await borrow.save();

  // Send success response with fine details
  res.status(200).json({
    success: true,
    message:
      fine !== 0
        ? `The book has returned successfully. The total charge, including a fine, are $${
            fine + book.price
          }`
        : `The book has been returned successfully. The total charge are $${book.price}`,
  });
});

// Get borrowed books for the logged-in user
export const borrowedBooks = catchAsyncErrors(async (req, res, next) => {
  const { borrowedBooks } = req.user; // Get borrowed books from the logged-in user
  res.status(200).json({
    success: true,
    borrowedBooks,
  });
});

// Get all borrowed books (for admin)
export const getBorrowedBooksForAdmin = catchAsyncErrors(
  async (req, res, next) => {
    const borrowedBooks = await Borrow.find(); // Get all Borrow records
    res.status(200).json({
      success: true,
      borrowedBooks,
    });
  }
);
