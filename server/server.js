import { app } from "./app.js"; // Import the Express application
import { v2 as cloudinary } from "cloudinary"; // Import Cloudinary for file uploads

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLIENT_NAME, // Cloudinary cloud name
  api_key: process.env.CLOUDINARY_CLIENT_API, // Cloudinary API key
  api_secret: process.env.CLOUDINARY_CLIENT_SECRET, // Cloudinary API secret
});

// Define the port for the server to listen on
const PORT = process.env.PORT || 5000; // Use the PORT environment variable or default to 5000

// Start the server
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
