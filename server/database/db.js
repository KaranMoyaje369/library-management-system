import mongoose from "mongoose";

export const connectDB = async () => {
  const MONGO_URI = process.env.MONGO_URI;

  mongoose
    .connect(MONGO_URI, {
      dbName: "MERN_Library_Management_System",
    })
    .then(() => {
      console.log("Database connected successfully.");
    })
    .catch((err) => {
      console.log("Error connecting to database.", err);
    });
};
