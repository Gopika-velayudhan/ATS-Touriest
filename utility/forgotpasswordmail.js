import transporter from "./Nodemailer.js";
import dotenv from "dotenv";
dotenv.config();

export const sendEmail = (email, token) => {
  return new Promise((resolve, reject) => {
    const mailOptions = {
      from: process.env.APP_EMAIL,
      to: email,
      subject: "Password Reset",
      html: `<p>You requested a password reset</p>
             <h2>Click on this <a href="${process.env.CLIENT_URL}/reset-password/${token}">link</a> to reset your password</h2>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        reject(new Error("Failed to send email"));
      } else {
        resolve();
      }
    });
  });
};
