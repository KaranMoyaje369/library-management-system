import express from "express"; // Import Express.js
import { config } from "dotenv"; // Import dotenv for environment variable configuration
import cookieParser from "cookie-parser"; // Import cookie-parser for handling cookies
import cors from "cors"; // Import cors for enabling Cross-Origin Resource Sharing
import { connectDB } from "./database/db.js"; // Import database connection function
import { errorMiddleware } from "./middlewares/errorMiddleware.js"; // Import error-handling middleware
import authRouter from "./routes/authRouter.js"; // Import authentication routes
import bookRouter from "./routes/bookRouter.js"; // Import book-related routes
import borrowRouter from "./routes/borrowRouter.js"; // Import borrowing-related routes
import userRouter from "./routes/userRouter.js"; // Import user-related routes
import expressFileUpload from "express-fileupload"; // Import express-fileupload for handling file uploads
import { notifyUsers } from "./services/notifyUsers.js"; // Import service for notifying users about overdue books
import { removeUnverifiedAccounts } from "./services/removeUnverifiedAccounts.js"; // Import service for removing unverified accounts

// Create an Express application
export const app = express();

// Load environment variables from the config file
config({ path: "./config/config.env" });

// Enable CORS with specific origin and methods
app.use(
  cors({
    origin: [process.env.FRONTEND_URL], // Allow requests from the frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"], // Allow specific HTTP methods
    credentials: true, // Allow cookies and credentials to be sent
  })
);

// Middleware to parse cookies
app.use(cookieParser());

// Middleware to parse JSON request bodies
app.use(express.json());

// Middleware to parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

// Middleware to handle file uploads
app.use(
  expressFileUpload({
    useTempFiles: true, // Use temporary files for uploads
    tempFileDir: "/tmp/", // Specify the directory for temporary files
  })
);

// Define routes
app.use("/api/v1/auth", authRouter); // Authentication routes
app.use("/api/v1/book", bookRouter); // Book-related routes
app.use("/api/v1/borrow", borrowRouter); // Borrowing-related routes
app.use("/api/v1/user", userRouter); // User-related routes

// Start background services
notifyUsers(); // Start the service to notify users about overdue books
removeUnverifiedAccounts(); // Start the service to remove unverified accounts

// Connect to the database
connectDB();

// Use error-handling middleware
app.use(errorMiddleware);
