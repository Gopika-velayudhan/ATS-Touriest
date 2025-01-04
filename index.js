import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import Userrouter from "./route/userRoutes.js";
import PackageRouter from "./route/packageRoutes.js";
import Activerouter from "./route/activeRoutes.js";
import ReviewRouter from "./route/reviewRoute.js";
import AdminRoute from "./route/adminRoute.js";
import passport from "./utility/PassportConfig.js";
import session from "express-session";
import googleRouter from "./route/googleroute.js";
import VisaRouter from "./route/VisaRoute.js";
import Cartrouter from "./route/cartRoutes.js";

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


app.use(
  session({
    secret: process.env.USER_ACCESS_TOKEN_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use("/api",VisaRouter)
app.use("/api",Cartrouter)
app.use("/api", Activerouter);
app.use("/api",googleRouter)
app.use('/api/admin',AdminRoute)
app.use("/api/auth", Userrouter);
app.use("/api", PackageRouter);

app.use("/api",ReviewRouter)




const port = process.env.PORT || 3005;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
