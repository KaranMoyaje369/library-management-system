import { generateVerificationOtpEmailTemplate } from "./emailTemplates.js"; // Import email template generator
import { sendEmail } from "./sendEmail.js"; // Import email sending utility

// Function to send a verification code (OTP) to the user's email
export async function sendVerificationCode(verificationCode, email, res) {
  try {
    // Generate the email content using the verification code
    const message = generateVerificationOtpEmailTemplate(verificationCode);

    // Send the email with the verification code
    await sendEmail({
      email, // Recipient's email address
      subject: "Verification Code (Bookworm Library Management System)", // Email subject
      message, // Email content (HTML)
    });

    // Send a success response to the client
    res.status(200).json({
      email: email, // Include the recipient's email in the response
      success: true, // Indicate success
      message: "Verification code sent successfully.", // Success message
    });
  } catch (error) {
    // Handle errors and send an error response to the client
    console.error("Error sending verification code:", error); // Log the error for debugging
    return res.status(500).json({
      success: false, // Indicate failure
      message: "Verification code failed to send.", // Error message
    });
  }
}
