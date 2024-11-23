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
import { singleImageUpload } from "../middileware/imageUpload.js";
import VerifyUserToken from "../middileware/UserAuth.js";
import {createBooking,getBookingHistory} from "../controller/BookingController.js"
const Userrouter = express.Router();

Userrouter.post("/userRegister", tryCatchMiddleware(userRegister))
  .post("/verify-otp", tryCatchMiddleware(verifyOTP))
  .post("/login", tryCatchMiddleware(userLogin))
  .post("/forgotpassword", tryCatchMiddleware(forgotPassword))
  .patch("/reset-password/:token", tryCatchMiddleware(resetPassword))
  .use(VerifyUserToken)
  .get("/users/:id",tryCatchMiddleware(getUserData))
  .put("/users/:id",singleImageUpload,tryCatchMiddleware(updateUser))
  .post("/bookings",tryCatchMiddleware(createBooking))
  .get('/bookings/history',tryCatchMiddleware(getBookingHistory))


export default Userrouter;
