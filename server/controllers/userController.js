import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js"; // Import async error handler
import ErrorHandler from "../middlewares/errorMiddleware.js"; // Import error handler
import { User } from "../models/userModel.js"; // Import User model
import bcrypt from "bcrypt"; // Import bcrypt for password hashing
import { v2 as cloudinary } from "cloudinary"; // Import Cloudinary for image uploads

// Get all users
export const getAllUsers = catchAsyncErrors(async (req, res, next) => {
  // Retrieve all users from the database
  const users = await User.find();

  // Send success response with the list of users
  res.status(200).json({
    success: true,
    users,
  });
});

// Register a new admin
export const registerNewAdmin = catchAsyncErrors(async (req, res, next) => {
  // Check if an avatar file is provided
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("Admin avatar is required.", 400));
  }

  const { name, email, password } = req.body;

  // Check if all required fields are provided
  if (!name || !email || !password) {
    return next(new ErrorHandler("Please fill all fields.", 400));
  }

  // Check if the user is already registered and verified
  const isRegister = await User.findOne({ email, accountVerified: true });
  if (isRegister) {
    return next(new ErrorHandler("User already registered.", 400));
  }

  // Validate password length
  if (password.length < 8 || password.length > 16) {
    return next(
      new ErrorHandler("Password must be between 8 to 16 characters long.", 400)
    );
  }

  const { avatar } = req.files;

  // Validate avatar file format
  const allowedFormats = ["image/png", "image/jpeg", "image/webp", "image/jpg"];
  if (!allowedFormats.includes(avatar.mimetype)) {
    return next(new ErrorHandler("File format not supported.", 400));
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Upload the avatar to Cloudinary
  const cloudinaryResponse = await cloudinary.uploader.upload(
    avatar.tempFilePath,
    {
      folder: "LIBRARY_MANAGEMENT_SYSTEM_ADMIN_AVATARS", // Folder in Cloudinary
    }
  );

  // Check if the Cloudinary upload was successful
  if (!cloudinaryResponse || cloudinaryResponse.error) {
    console.error(
      "Cloudinary error:",
      cloudinaryResponse.error || "Unknown Cloudinary error."
    );
    return next(
      new ErrorHandler("Failed to upload avatar image to Cloudinary.", 500)
    );
  }

  // Create a new admin user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: "Admin", // Set role to "Admin"
    accountVerified: true, // Mark account as verified
    avatar: {
      public_id: cloudinaryResponse.public_id, // Cloudinary public ID
      url: cloudinaryResponse.secure_url, // Cloudinary secure URL
    },
  });

  // Send success response
  res.status(201).json({
    success: true,
    message: "Admin registered successfully.",
    user,
  });
});
