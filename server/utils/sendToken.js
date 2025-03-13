// Function to send a JWT token to the client
export const sendToken = (user, statusCode, message, res) => {
  // Generate a JWT token using the user's method
  const token = user.generateToken();

  // Set the token as a cookie in the response
  res
    .status(statusCode) // Set the HTTP status code
    .cookie("token", token, {
      expires: new Date(
        Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000 // Calculate expiration date
      ),
      httpOnly: true, // Prevent client-side JavaScript from accessing the cookie
      secure: process.env.NODE_ENV === "production", // Ensure cookies are only sent over HTTPS in production
      sameSite: "strict", // Prevent CSRF attacks
    })
    .json({
      success: true, // Indicate success
      user, // Send user details
      message, // Send a success message
      token, // Send the token in the response body (optional)
    });
};
