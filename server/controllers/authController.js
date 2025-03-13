import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { User } from "../models/userModel.js";
import bcrypt from "bcrypt";
import crypto from "crypto";

import { sendVerificationCode } from "../utils/sendVerificationCode.js";
import { sendToken } from "../utils/sendToken.js";
import { sendEmail } from "../utils/sendEmail.js";
import { generateForgetPasswordEmailTemplate } from "../utils/emailTemplates.js";

// Register a new user
export const register = catchAsyncErrors(async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if all required fields are provided
    if (!name || !email || !password) {
      return next(new ErrorHandler("Please enter all fields.", 400));
    }

    // Check if the user is already registered and verified
    const isRegistered = await User.findOne({ email, accountVerified: true });
    if (isRegistered) {
      return next(new ErrorHandler("User Already Exists.", 400));
    }

    // Check if the user has exceeded the number of registration attempts
    const registerationAttemptsByUser = await User.find({
      email,
      accountVerified: false,
    });
    if (registerationAttemptsByUser.length >= 5) {
      return next(
        new ErrorHandler(
          "You have exceeded the number of registration attempts. Please contact support.",
          400
        )
      );
    }

    // Validate password length
    if (password.length < 8 || password.length > 16) {
      return next(
        new ErrorHandler(
          "Password length must be between 8 and 16 characters.",
          400
        )
      );
    }

    // Hash the password
    const hashPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = await User.create({
      name,
      email,
      password: hashPassword,
    });

    // Generate and send a verification code
    const verificationCode = await user.generateVerificationCode();
    await user.save();
    sendVerificationCode(verificationCode, email, res);
  } catch (error) {
    next(error);
  }
});

// Verify OTP for account verification
export const verifyOTP = catchAsyncErrors(async (req, res, next) => {
  const { email, otp } = req.body;

  // Check if email and OTP are provided
  if (!email || !otp) {
    return next(new ErrorHandler("Email or OTP is Missing.", 400));
  }

  try {
    // Find all unverified user entries with the given email
    const userAllEntries = await User.find({
      email,
      accountVerified: false,
    }).sort({ createdAt: -1 });

    // Check if any user entries exist
    if (!userAllEntries || userAllEntries.length === 0) {
      return next(new ErrorHandler("User Not Found.", 404));
    }

    let user;

    // If multiple entries exist, keep the latest one and delete the rest
    if (userAllEntries.length > 1) {
      user = userAllEntries[0];
      await User.deleteMany({
        _id: { $ne: user._id },
        email,
        accountVerified: false,
      });
    } else {
      user = userAllEntries[0];
    }

    // Check if the OTP is valid
    if (!user.verificationCode || user.verificationCode !== Number(otp)) {
      return next(new ErrorHandler("Invalid OTP.", 400));
    }

    // Check if the OTP has expired
    const currentTime = Date.now();
    const verificationCodeExpire = new Date(
      user.verificationCodeExpire
    ).getTime();
    if (currentTime > verificationCodeExpire) {
      return next(new ErrorHandler("OTP Expired.", 400));
    }

    // Mark the user as verified and clear the verification code
    user.accountVerified = true;
    user.verificationCode = null;
    user.verificationCodeExpire = null;
    await user.save({ validateModifiedOnly: true });

    // Send a token to the client
    sendToken(user, 200, "Account Verified.", res);
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler("Internal Server Error.", 500));
  }
});

// Login a user
export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
    return next(new ErrorHandler("Please enter all fields.", 400));
  }

  // Find the user by email and include the password field
  const user = await User.findOne({ email, accountVerified: true }).select(
    "+password"
  );

  // Check if the user exists
  if (!user) {
    return next(new ErrorHandler("Invalid Email or Password.", 400));
  }

  // Compare the provided password with the hashed password
  const isPasswordMatched = await bcrypt.compare(password, user.password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid Email or Password.", 400));
  }

  // Send a token to the client
  sendToken(user, 200, "User login successfully.", res);
});

// Logout a user
export const logout = catchAsyncErrors(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", "", {
      expires: new Date(Date.now()), // Expire the token immediately
      httpOnly: true, // Prevent client-side access to the cookie
    })
    .json({
      success: true,
      message: "Logged out successfully",
    });
});

// Get the currently logged-in user
export const getUser = catchAsyncErrors(async (req, res, next) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    user,
  });
});

// Handle forgot password request
export const forgetPassword = catchAsyncErrors(async (req, res, next) => {
  if (!req.body.email) {
    return next(new ErrorHandler("Email is Required.", 400));
  }

  // Find the user by email
  const user = await User.findOne({
    email: req.body.email,
    accountVerified: true,
  });

  // Check if the user exists
  if (!user) {
    return next(new ErrorHandler("Invalid Email.", 400));
  }

  // Generate a reset password token
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  // Create the reset password URL
  const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;

  // Generate the email template
  const message = generateForgetPasswordEmailTemplate(resetPasswordUrl);

  try {
    // Send the email
    await sendEmail({
      email: user.email,
      subject: "Bookworm Library Management Password Recovery.",
      message,
    });
    res.status(200).json({
      success: true,
      message: `Email Sent to ${user.email} successfully.`,
    });
  } catch (error) {
    // Clear the reset password token if email sending fails
    user.resetPasswordToken = undefined;
    user.resetPasswordExpired = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler(error.message, 500));
  }
});

// Reset the user's password
export const resetPassword = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.params;

  // Hash the token to compare with the stored token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  // Find the user by the reset token and check if it has expired
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpired: { $gt: Date.now() },
  });

  // Check if the user exists
  if (!user) {
    return next(
      new ErrorHandler(
        "Reset password token is invalid or has been expired.",
        400
      )
    );
  }

  // Check if the password and confirm password match
  if (req.body.password !== req.body.confirmPassword) {
    return next(
      new ErrorHandler("Password and confirm password do not match.", 400)
    );
  }

  // Validate password length
  if (
    req.body.password.length < 8 ||
    req.body.password.length > 16 ||
    req.body.confirmPassword.length < 8 ||
    req.body.confirmPassword.length > 16
  ) {
    return next(new ErrorHandler("Password must be 8 and 16 characters.", 400));
  }

  // Hash the new password and save it
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  user.password = hashedPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpired = undefined;

  await user.save();

  // Send a token to the client
  sendToken(user, 200, "Password reset successfully.", res);
});

// Update the user's password
export const updatePassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user._id).select("+password");

  // Check if the user exists
  if (!user) {
    return next(new ErrorHandler("User not found.", 404));
  }

  const { currentPassword, newPassword, confirmNewPassword } = req.body;

  // Check if all fields are provided
  if (!currentPassword || !newPassword || !confirmNewPassword) {
    return next(new ErrorHandler("Please Enter all fields.", 400));
  }

  // Compare the current password with the stored password
  const isPasswordMatched = await bcrypt.compare(
    currentPassword,
    user.password
  );
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Current Password is incorrect.", 400));
  }

  // Validate password length
  if (
    newPassword.length < 8 ||
    newPassword.length > 16 ||
    confirmNewPassword.length < 8 ||
    confirmNewPassword.length > 16
  ) {
    return next(new ErrorHandler("Password must be 8 and 16 characters.", 400));
  }

  // Check if the new password and confirm password match
  if (newPassword !== confirmNewPassword) {
    return next(
      new ErrorHandler(
        "New Password and Confirm New Password do not match.",
        400
      )
    );
  }

  // Hash the new password and save it
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  await user.save();
  res.status(200).json({
    success: true,
    message: "Password Updated.",
  });
});
