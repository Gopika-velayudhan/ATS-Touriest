import crypto from "crypto";
import transporter from "./Nodemailer.js";

export const sendOTP = async (email) => {
  const otp = crypto.randomInt(100000, 999999).toString();

  const mailOptions = {
    from: process.env.APP_EMAIL,
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP code is ${otp}`,
    html: `<b>Your OTP code is ${otp}</b>`,
  };

  await transporter.sendMail(mailOptions);

  return otp;
};
