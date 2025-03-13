import cron from "node-cron";
import { Borrow } from "../models/borrowModel.js";
import { sendEmail } from "../utils/sendEmail.js";
import { User } from "../models/userModel.js";

export const notifyUsers = () => {
  cron.schedule("*/10 * * * * *", async () => {
    try {
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const borrowers = await Borrow.find({
        dueDate: {
          $lt: oneDayAgo,
        },

        returnDate: null,
        notified: false,
      });

      for (const element of borrowers) {
        if (element.user && element.user.email) {
          const user = await User.findById(element.user.id);
          sendEmail({
            email: element.user.email,
            subject: "Book return reminder.",
            message: `Hello ${element.user.name}, \n\n This is a reminder that the book you borrowed is due for return today. Please return the book to the library as soon as possible. \n\n Thank You.`,
          });
          element.notified = true;
          await element.save();
          console.log(`email send to ${element.user.email}`);
        }
      }
    } catch (error) {
      console.log("Some error occured while notifying users.", error);
    }
  });
};
