import mongoose from "mongoose";

// Define the Book schema
const bookSchema = mongoose.Schema(
  {
    // Title of the book
    title: {
      type: String,
      required: true, // Title is required
      trim: true, // Removes extra spaces from the beginning and end
    },

    // Author of the book
    author: {
      type: String,
      required: true, // Author is required
      trim: true, // Removes extra spaces from the beginning and end
    },

    // Description of the book
    description: {
      type: String,
      required: true, // Description is required
    },

    // Price of the book
    price: {
      type: Number,
      required: true, // Price is required
    },

    // Quantity of the book available in the library
    quantity: {
      type: Number,
      required: true, // Quantity is required
    },

    // Availability status of the book
    availability: {
      type: Boolean,
      default: true, // Default availability is true
    },
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
  }
);

// Create and export the Book model
export const Book = mongoose.model("Book", bookSchema);
