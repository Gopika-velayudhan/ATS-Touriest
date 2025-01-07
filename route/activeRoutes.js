import express from "express";
import {
  createActivity,
  getAllActivities,
  getSingleActivity,
  updateActivity,
  deleteActivity,
  searchActivities,
} from "../controller/ActivityController.js";
import { multipleImageUpload } from "../middileware/imageUpload.js";
import { tryCatchMiddleware } from "../middileware/ErrorHandler.js";
import VerifyUserToken from "../middileware/UserAuth.js";
import verifyAdmintoken from "../middileware/AdminAuth.js";

const Activerouter = express.Router();
Activerouter.get("/activities/search", tryCatchMiddleware(searchActivities))
  .post(
    "/activities",
    verifyAdmintoken,
    // multipleImageUpload,
    tryCatchMiddleware(createActivity)
  )

  .get("/activities", tryCatchMiddleware(getAllActivities))

  .get(
    "/activities/:id",
    VerifyUserToken,
    tryCatchMiddleware(getSingleActivity)
  )
  .put(
    "/activities/:id",
    verifyAdmintoken,
    multipleImageUpload,
    tryCatchMiddleware(updateActivity)
  )
  .delete(
    "/activities/:id",
    verifyAdmintoken,
    tryCatchMiddleware(deleteActivity)
  );

export default Activerouter;
