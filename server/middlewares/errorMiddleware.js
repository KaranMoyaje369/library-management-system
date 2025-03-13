// Custom ErrorHandler class to extend the built-in Error class
class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message); // Call the parent Error class constructor
    this.statusCode = statusCode; // Add a statusCode property to the error object
  }
}

// Error-handling middleware
export const errorMiddleware = (err, req, res, next) => {
  // Set default error message and status code if not provided
  err.message = err.message || "Internal Server Error";
  err.statusCode = err.statusCode || 500;

  // Handle duplicate key errors (MongoDB error code 11000)
  if (err.code === 11000) {
    const statusCode = 400;
    const message = `Duplicate Field Value Entered.`;
    err = new ErrorHandler(message, statusCode);
  }

  // Handle invalid JSON Web Token errors
  if (err.name === "JsonWebTokenError") {
    const statusCode = 401;
    const message = `JSON Web Token is Invalid. Try Again.`;
    err = new ErrorHandler(message, statusCode);
  }

  // Handle expired JSON Web Token errors
  if (err.name === "TokenExpiredError") {
    const statusCode = 401;
    const message = `JSON Web Token is Expired. Try Again.`;
    err = new ErrorHandler(message, statusCode);
  }

  // Handle CastError (e.g., invalid ObjectId in MongoDB)
  if (err.name === "CastError") {
    const statusCode = 400;
    const message = `Resource Not Found. Invalid: ${err.path}`;
    err = new ErrorHandler(message, statusCode);
  }

  // Handle validation errors (e.g., Mongoose validation errors)
  const errorMessage = err.errors
    ? Object.values(err.errors)
        .map((error) => error.message)
        .join(" ") // Combine multiple error messages into a single string
    : err.message;

  // Send the error response to the client
  return res.status(err.statusCode).json({
    success: false,
    message: errorMessage,
  });
};

// Export the ErrorHandler class and errorMiddleware
export default ErrorHandler;
