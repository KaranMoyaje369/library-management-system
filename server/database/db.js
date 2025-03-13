import mongoose from "mongoose"; // Import Mongoose for MongoDB connection

// Function to connect to the MongoDB database
export const connectDB = async () => {
  const MONGO_URI = process.env.MONGO_URI; // Get the MongoDB connection URI from environment variables

  // Connect to the MongoDB database
  mongoose
    .connect(MONGO_URI, {
      dbName: "MERN_Library_Management_System", // Specify the database name
    })
    .then(() => {
      // Log a success message if the connection is successful
      console.log("Database connected successfully.");
    })
    .catch((err) => {
      // Log an error message if the connection fails
      console.log("Error connecting to database.", err);
    });
};
