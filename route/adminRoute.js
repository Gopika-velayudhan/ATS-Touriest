import express from 'express'
import { adminLogin,allUser,getUserById,blockuser } from '../controller/AdminController.js'
import { tryCatchMiddleware } from '../middileware/ErrorHandler.js'
import {getAllBookingDetails,getBookingHistory} from "../controller/BookingController.js"
import verifyAdmintoken from '../middileware/AdminAuth.js'

const AdminRoute = express.Router()

AdminRoute

.post('/login',tryCatchMiddleware(adminLogin))
.use(verifyAdmintoken)
.get("/allusers",tryCatchMiddleware(allUser))
.get('/users/:id',tryCatchMiddleware(getUserById))
.patch("/users/:id", blockuser)
.get('/bookings',tryCatchMiddleware(getAllBookingDetails))





export default AdminRoute