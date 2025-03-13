import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import crypto from "crypto";

// Define the User schema
const userSchema = new mongoose.Schema(
  {
    // User's name
    name: {
      type: String,
      required: true, // Name is required
      trim: true, // Removes extra spaces from the beginning and end
    },

    // User's email
    email: {
      type: String,
      required: true, // Email is required
      lowercase: true, // Converts email to lowercase
    },

    // User's password
    password: {
      type: String,
      required: true, // Password is required
      select: false, // Excludes password from query results by default
    },

    // User's role (Admin or User)
    role: {
      type: String,
      enum: ["Admin", "User"], // Restricts role to either "Admin" or "User"
      default: "User", // Default role is "User"
    },

    // Indicates whether the user's account is verified
    accountVerified: { type: Boolean, default: false },

    // List of books borrowed by the user
    borrowedBooks: [
      {
        bookId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Borrow", // References the Borrow model
        },
        returned: {
          type: Boolean,
          default: false, // Indicates whether the book has been returned
        },
        bookTitle: String, // Title of the borrowed book
        borrowDate: Date, // Date the book was borrowed
        dueDate: Date, // Due date for returning the book
      },
    ],

    // User's avatar (profile picture)
    avatar: {
      public_id: String, // Public ID for the image (used by Cloudinary)
      url: String, // URL of the image
    },

    // Verification code for account verification
    verificationCode: Number,
    // Expiration time for the verification code
    verificationCodeExpire: Date,

    // Token for resetting the password
    resetPasswordToken: String,
    // Expiration time for the reset password token
    resetPasswordExpired: Date,
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
  }
);

// Method to generate a 5-digit verification code
userSchema.methods.generateVerificationCode = function () {
  // Helper function to generate a random 5-digit number
  function generateRandomFiveDigitNumber() {
    const firstDigit = Math.floor(Math.random() * 9) + 1; // Ensures the first digit is not 0
    const remainingDigits = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0"); // Ensures the remaining 4 digits are padded with zeros if necessary
    return Number(`${firstDigit}${remainingDigits}`);
  }

  // Generate the verification code and set its expiration time (15 minutes from now)
  const verificationCode = generateRandomFiveDigitNumber();
  this.verificationCode = verificationCode;
  this.verificationCodeExpire = Date.now() + 15 * 60 * 1000; // 15 minutes in milliseconds
  return verificationCode;
};

// Method to generate a JWT token for authentication
userSchema.methods.generateToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE, // Token expiration time
  });
};

// Method to generate a reset password token
userSchema.methods.getResetPasswordToken = function () {
  // Generate a random token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hash the token and save it to the database
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Set the expiration time for the reset token (15 minutes from now)
  this.resetPasswordExpired = Date.now() + 15 * 60 * 1000; // 15 minutes in milliseconds

  return resetToken;
};

// Create and export the User model
export const User = mongoose.model("User", userSchema);
