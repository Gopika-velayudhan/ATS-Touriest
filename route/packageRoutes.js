import express from "express";
import { multipleImageUpload } from "../middileware/imageUpload.js";
import { tryCatchMiddleware } from "../middileware/ErrorHandler.js";
import {
  createPackacge,
  getallpackage,
  SinglePackage,
  updatepackages,
  deletepackage,
  searchPackages,
  Wishlist,
  showwishlist,
  deletewishlist,
} from "../controller/PackageController.js";
import verifyAdmintoken from "../middileware/AdminAuth.js";
import verifyUsertoken from "../middileware/UserAuth.js";

const PackageRouter = express.Router();

PackageRouter.post(
  "/packages",
  // multipleImageUpload,
  verifyAdmintoken,
  tryCatchMiddleware(createPackacge)
)

  .get("/packages", tryCatchMiddleware(getallpackage))
  .get("/packages/search", tryCatchMiddleware(searchPackages))
  .get("/packages/:id", verifyUsertoken, tryCatchMiddleware(SinglePackage))

  .put(
    "/packages/:id",
    verifyAdmintoken,
    multipleImageUpload,
    tryCatchMiddleware(updatepackages)
  )
  .delete("/packages/:id", verifyAdmintoken, tryCatchMiddleware(deletepackage))
  .post("/wishlists/:id", verifyUsertoken, tryCatchMiddleware(Wishlist))
  .get("/wishlists/:id", verifyUsertoken, tryCatchMiddleware(showwishlist))
  .delete(
    "/wishlists/:id",
    verifyUsertoken,
    tryCatchMiddleware(deletewishlist)
  );

export default PackageRouter;
