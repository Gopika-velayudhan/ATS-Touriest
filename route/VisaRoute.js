import express from "express";

import { tryCatchMiddleware } from "../middileware/ErrorHandler.js";
import {
    createVisa,
    getAllVisas,
    getVisaById,
    updateVisa,
    deleteVisa,
    searchVisas,
    submitInquiry
} from "../controller/VisaController.js";
import verifyAdmintoken from "../middileware/AdminAuth.js"; 
import VerifyUserToken from "../middileware/UserAuth.js"; 
import { multipleImageUpload, singleImageUpload } from "../middileware/imageUpload.js";


const VisaRouter = express.Router();

VisaRouter.post(
  "/visas",
  
  verifyAdmintoken, 
  tryCatchMiddleware(createVisa)
)
  .get("/visas", tryCatchMiddleware(getAllVisas)) 
  .get("/visas/search", tryCatchMiddleware(searchVisas)) 
  .get("/visas/:id", VerifyUserToken, tryCatchMiddleware(getVisaById)) 
  .post("/Inquiry",VerifyUserToken,tryCatchMiddleware(submitInquiry))
  .put("/visas/:id", verifyAdmintoken, tryCatchMiddleware(updateVisa)) 
  .delete("/visas/:id", verifyAdmintoken, tryCatchMiddleware(deleteVisa))


export default VisaRouter;
