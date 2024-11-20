import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import Userrouter from "./route/userRoutes.js";
import PackageRouter from "./route/packageRoutes.js";

dotenv.config();

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app.use((err, req, res, next) => {
//   console.error("Error:", err);
//   const statusCode = err.statusCode || 500;
//   const message = err.message || "Internal server error";
//   res.status(statusCode).json({
//     success: false,
//     statusCode,
//     message,
//   });
// });
app.use("/api/auth",Userrouter)
app.use("/api",PackageRouter)

const port = process.env.PORT || 3005;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
