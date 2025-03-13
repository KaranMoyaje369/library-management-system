import cron from "node-cron"; // Import node-cron for scheduling tasks
import { Borrow } from "../models/borrowModel.js"; // Import Borrow model
import { sendEmail } from "../utils/sendEmail.js"; // Import email sending utility
import { User } from "../models/userModel.js"; // Import User model

// Function to notify users about overdue books
export const notifyUsers = () => {
  // Schedule a cron job to run every 10 seconds
  cron.schedule("*/10 * * * * *", async () => {
    try {
      // Calculate the date and time 24 hours ago
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

      // Find all borrowers with overdue books who haven't been notified yet
      const borrowers = await Borrow.find({
        dueDate: {
          $lt: oneDayAgo, // Due date is earlier than 24 hours ago
        },
        returnDate: null, // Book has not been returned
        notified: false, // User has not been notified yet
      });

      // Iterate through each borrower and send a reminder email
      for (const element of borrowers) {
        if (element.user && element.user.email) {
          // Find the user by ID (optional, if additional user details are needed)
          const user = await User.findById(element.user.id);

          // Send a reminder email to the user
          await sendEmail({
            email: element.user.email, // Recipient's email address
            subject: "Book return reminder.", // Email subject
            message: `Hello ${element.user.name}, \n\n This is a reminder that the book you borrowed is due for return today. Please return the book to the library as soon as possible. \n\n Thank You.`, // Email content
          });

          // Mark the user as notified
          element.notified = true;
          await element.save();

          // Log the email sending process
          console.log(`Email sent to ${element.user.email}`);
        }
      }
    } catch (error) {
      // Handle errors and log them
      console.log("Some error occurred while notifying users.", error);
    }
  });
};
