import mongoose from "mongoose";

// Define the Borrow schema
const borrowSchema = mongoose.Schema(
  {
    // User who borrowed the book
    user: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to the User model
        required: true, // User ID is required
      },
      name: {
        type: String,
        required: true, // User name is required
      },
      email: {
        type: String,
        required: true, // User email is required
      },
    },

    // Book that was borrowed
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book", // Reference to the Book model
      required: true, // Book ID is required
    },

    // Price of the book at the time of borrowing
    price: {
      type: Number,
      required: true, // Price is required
    },

    // Date the book was borrowed
    borrowDate: {
      type: Date,
      default: Date.now, // Defaults to the current date and time
    },

    // Due date for returning the book
    dueDate: {
      type: Date,
      required: true, // Due date is required
    },

    // Date the book was returned (null if not returned yet)
    returnDate: {
      type: Date,
      default: null, // Defaults to null (not returned yet)
    },

    // Fine amount for late returns
    fine: {
      type: Number,
      default: 0, // Default fine is 0
    },

    // Indicates whether the user has been notified about the due date
    notified: {
      type: Boolean,
      default: false, // Default is false (not notified yet)
    },
  },
  { timestamps: true } // Automatically adds `createdAt` and `updatedAt` fields
);

// Create and export the Borrow model
export const Borrow = mongoose.model("Borrow", borrowSchema);
