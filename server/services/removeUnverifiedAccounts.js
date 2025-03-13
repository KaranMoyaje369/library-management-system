import cron from "node-cron"; // Import node-cron for scheduling tasks
import { User } from "../models/userModel.js"; // Import User model

// Function to remove unverified user accounts
export const removeUnverifiedAccounts = () => {
  // Schedule a cron job to run every 5 minutes
  cron.schedule("*/5 * * * *", async () => {
    // Calculate the date and time 30 minutes ago
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);

    // Delete all unverified accounts created more than 30 minutes ago
    await User.deleteMany({
      accountVerified: false, // Account is not verified
      createdAt: { $lt: thirtyMinutesAgo }, // Account was created more than 30 minutes ago
    });
  });
};
