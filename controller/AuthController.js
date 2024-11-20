import User from "../model/AuthSchema.js";
import { sendOTP } from "../utility/otpverification.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { userValidationSchema } from "../model/ValidationSchema.js";
import dotenv from "dotenv";
import { sendEmail } from "../utility/forgotpasswordmail.js";
dotenv.config();

const otpStore = new Map();

export const userRegister = async (req, res) => {
  const { value, error } = userValidationSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      statusCode: 400,
      message: "Validation error",
      data: null,
    });
  }

  const { name, email, address, phoneNumber, password } = value;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await User.findOne({ name });
    if (existingUser) {
      return res.status(400).json({
        statusCode: 400,
        message: "username already taken",
        data: null,
      });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({
        statusCode: 400,
        message: "email already registerd",
        data: null,
      });
    }

    const otp = await sendOTP(email);
    otpStore.set(email, { otp, timestamp: Date.now() });

    const userData = {
      name,
      email,
      address,
      phoneNumber,
      password: hashedPassword,
    };
    otpStore.set(`${email}_data`, userData);

    res.status(200).json({
      statusCode: 200,
      message: "OTP sent to email. Please verify.",
      data: null,
    });
  } catch (err) {
    console.error("Error during user registration:", err);
    res.status(500).json({
      statusCode: 500,
      message: "internal server error",
      data: null,
    });
  }
};

export const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  const storedOtpData = otpStore.get(email);
  const userData = otpStore.get(`${email}_data`);

  if (
    !storedOtpData ||
    storedOtpData.otp !== otp ||
    Date.now() - storedOtpData.timestamp > 10 * 60 * 1000
  ) {
    return res.status(400).json({
      statusCode: 400,
      message: "invalid or expaired otp",
      data: null,
    });
  }

  try {
    const newUser = new User(userData);
    await newUser.save();

    otpStore.delete(email);
    otpStore.delete(`${email}_data`);

    res.status(201).json({
      statusCode: 201,
      message: "User successfully registered.",
      data: newUser,
    });
  } catch (err) {
    console.error("Error during OTP verification:", err);
    res
      .status(500)
      .json({ statusCode: 500, message: "internal server error", data: null });
  }
};

export const userLogin = async (req, res) => {
  const { value, error } = userValidationSchema.validate(req.body);

  const { email, password } = value;
  try {
    const validUser = await User.findOne({ email });

    if (!validUser) {
      return res.status(404).json({
        statusCode: 404,
        message: "user not found",
        data: null,
      });
    }
    if (validUser.isBlocked) {
      return res.status(403).json({
        statusCode: 403,
        message: "user is blocked",
        data: null,
      });
    }
    const validPassword = await bcrypt.compare(password, validUser.password);
    if (!validPassword) {
      return res.status(401).json({
        statusCode: 401,
        message: "incorrect passowrd",
        data: null,
      });
    }
    const token = jwt.sign(
      { id: validUser._id },
      process.env.USER_ACCESS_TOKEN_SECRET
    );
    res.status(200).json({
      statusCode: 200,
      message: "user login successfully",
      data: token,
      validUser,
    });
  } catch (error) {
    console.error("Error during OTP verification:", err);
    res
      .status(500)
      .json({ statusCode: 500, message: "internal server error", data: null });
  }
};
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        statusCode: 400,
        message: "Validation Error: Email is required",
        data: null,
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        statusCode: 404,
        message: "User not found",
        data: null,
      });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.USER_ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );

    await sendEmail(email, token);

    return res.status(200).json({
      statusCode: 200,
      message: "Password reset email sent successfully",
      data: null,
    });
  } catch (err) {
    console.error("Error in forgotpassword:", err);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  if (!newPassword) {
    return res.status(400).json({
      statusCode: 400,
      message: "Validation Error: New password is required",
      data: null,
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.USER_ACCESS_TOKEN_SECRET);

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const user = await UserModel.findByIdAndUpdate(
      decoded.id,
      { password: hashedPassword },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        statusCode: 404,
        message: "User not found",
        data: null,
      });
    }

    return res.status(200).json({
      statusCode: 200,
      message: "Password reset successfully",
      data: newPassword,
    });
  } catch (err) {
    console.error("Error in resetpassword:", err);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getUserData = async (req, res) => {
    const { id } = req.params;
  
    try {
      const user = await User.findById(id).select("-password");
  
      if (!user) {
        return res
          .status(404)
          .json({ statusCode: 404, message: "User not found",data:null });
      }
  
      return res.status(200).json({ statusCode:200,message:"user fetched successfully", data:user });
    } catch (error) {
      return res
        .status(500)
        .json({ statusCode: 500, message: "internal server error",data:null });
    }
  };

  export const updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, email, address,phoneNumber } = req.body;
  
    try {
      const updatedData = { name, email, address,phoneNumber };
  
     
  
      const updatedUser = await User.findByIdAndUpdate(id, updatedData, {
        new: true,
      });
  
      if (!updatedUser) {
        return res
          .status(404)
          .json({ statusCode: 404, message: "User not found",data:null });
      }
  
      return res.status(200).json({ statusCode:200,message:"user updataed successfully", data: updatedUser });
    } catch (error) {
      return res
        .status(500)
        .json({ statusCode: 500, message: "internal server error",data:null });
    }
  };
  
