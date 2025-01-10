import transporter from "./Nodemailer.js";
import dotenv from "dotenv";

dotenv.config();

/**
 
 * @param {string} email 
 * @param {string} bookingReferenceId 
 * @param {object} bookingDetails 
 * @returns {Promise<void>}
 */
export const sendBookingConfirmationEmail = (
  email,
  bookingReferenceId,
  bookingDetails
) => {
  return new Promise((resolve, reject) => {
    const mailOptions = {
      from: process.env.APP_EMAIL,
      to: email,
      subject: "Booking Confirmation",
      html: `
        <h1>Booking Confirmation</h1>
        <p>Thank you for your booking!</p>
        <p><strong>Booking Reference ID:</strong> ${bookingReferenceId}</p>
        <p><strong>Package:</strong> ${bookingDetails.packageName}</p>
        <p><strong>Check-In:</strong> ${new Date(
          bookingDetails.checkInTime
        ).toLocaleString()}</p>
        <p><strong>Check-Out:</strong> ${new Date(
          bookingDetails.checkOutTime
        ).toLocaleString()}</p>
        <p><strong>Total Price:</strong> $${bookingDetails.totalPrice}</p>
        <p>If you have any questions, feel free to contact us.</p>
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending booking confirmation email:", error);
        reject(new Error("Failed to send booking confirmation email"));
      } else {
        console.log("Booking confirmation email sent:", info.response);
        resolve();
      }
    });
  });
};
