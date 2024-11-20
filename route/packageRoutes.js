import express from "express";
import multipleImageUpload from "../middileware/imageUpload.js";
import { tryCatchMiddleware } from "../middileware/ErrorHandler.js";
import {createPackacge,getallpackage,SinglePackage,updatepackages,deletepackage} from '../controller/PackageController.js'

const PackageRouter = express.Router()

PackageRouter
.post("/packages", multipleImageUpload ,tryCatchMiddleware (createPackacge))
.get("/packages",tryCatchMiddleware(getallpackage))
.get("/packages/:id",tryCatchMiddleware(SinglePackage))
.put("/packages/:id",multipleImageUpload,tryCatchMiddleware(updatepackages))
.delete("/packages/:id",tryCatchMiddleware(deletepackage))

export default PackageRouter