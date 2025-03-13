import nodeMailer from "nodemailer"; // Import Nodemailer for sending emails

// Function to send an email
export const sendEmail = async ({ email, subject, message }) => {
  // Create a transporter object using the SMTP settings from environment variables
  const transporter = nodeMailer.createTransport({
    host: process.env.SMTP_HOST, // SMTP server host
    service: process.env.SMTP_SERVICE, // SMTP service (e.g., Gmail)
    port: process.env.SMTP_PORT, // SMTP port
    auth: {
      user: process.env.SMTP_USER, // SMTP username (email address)
      pass: process.env.SMTP_PASSWORD, // SMTP password (app password)
    },
  });

  // Define the email options
  const mailOptions = {
    from: process.env.SMTP_MAIL, // Sender email address
    to: email, // Recipient email address
    subject, // Email subject
    html: message, // Email content (HTML format)
  };

  // Send the email
  await transporter.sendMail(mailOptions);
};
