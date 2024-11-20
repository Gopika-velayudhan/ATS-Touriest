import express from "express";
import {
  userRegister,
  verifyOTP,
  userLogin,
  forgotPassword,
  resetPassword,
  getUserData,
  updateUser
} from "../controller/AuthController.js";
import { tryCatchMiddleware } from "../middileware/ErrorHandler.js";
const Userrouter = express.Router();

Userrouter.post("/userRegister", tryCatchMiddleware(userRegister))
  .post("/verify-otp", tryCatchMiddleware(verifyOTP))
  .post("/login", tryCatchMiddleware(userLogin))
  .post("/forgotpassword", tryCatchMiddleware(forgotPassword))
  .patch("/reset-password/:token", tryCatchMiddleware(resetPassword))
  .get("/users/:id",tryCatchMiddleware(getUserData))
  .put("/users/:id",tryCatchMiddleware(updateUser))


export default Userrouter;
