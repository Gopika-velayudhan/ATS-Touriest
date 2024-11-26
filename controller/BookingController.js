import PackageBooking from "../model/BookingSchema.js";
import { packageBookingValidationSchema } from "../model/ValidationSchema.js";
import Package from "../model/PackageSchema.js";
import User from "../model/AuthSchema.js";

import crypto from "crypto"; 

export const createBooking = async (req, res) => {
  const { value, error } = packageBookingValidationSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      statusCode: 400,
      message: error.details.map((detail) => detail.message),
      data: null,
    });
  }

  try {
    
    const packageExists = await Package.findById(value.packageId);
    if (!packageExists) {
      return res.status(404).json({
        statusCode: 404,
        message: "Selected package does not exist",
        data: null,
      });
    }

    
    if (new Date(value.checkOutTime) <= new Date(value.checkInTime)) {
      return res.status(400).json({
        statusCode: 400,
        message: "Check-out time must be after check-in time",
        data: null,
      });
    }

    // Generate a unique booking reference ID
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().slice(0, 10).replace(/-/g, ""); 
    const randomString = crypto.randomBytes(3).toString("hex").toUpperCase();
    const bookingReferenceId = `PKG-${formattedDate}-${randomString}`;

    
    const newBooking = new PackageBooking({
      ...value,
      userId: req.user.userId,
      bookingReferenceId
    });

    const savedBooking = await newBooking.save();

    return res.status(201).json({
      statusCode: 201,
      message: "Package and activities booked successfully",
      bookingId: savedBooking._id,
      bookingReferenceId: savedBooking.bookingReferenceId,
      data: savedBooking,
    });
  } catch (err) {
    console.error("Error creating booking:", err);
    return res.status(500).json({
      statusCode: 500,
      message: "Internal server error",
      data: null,
    });
  }
};


export const getBookingHistory = async (req, res) => {
  const { userId } = req.user;

  try {
    const bookings = await PackageBooking.find({ userId })
      .populate("packageId", "name description price")
      .populate("activityIds", "name description price duration")
      .populate("userId", "firstName lastName email phoneNumber")
      .exec();

    if (!bookings.length) {
      return res.status(404).json({
        statusCode: 404,
        message: "No previous bookings found",
        data: null,
      });
    }

    return res.status(200).json({
      statusCode: 200,
      message: "Booking history fetched successfully",
      data: bookings,
    });
  } catch (err) {
    console.error("Error fetching bookings:", err);
    return res.status(500).json({
      statusCode: 500,
      message: "Internal server error",
      data: null,
    });
  }
};

export const getAllBookingDetails = async (req, res) => {
  try {
    const bookings = await PackageBooking.find()
      .populate("packageId", "name description price")
      .populate("activityIds", "name description price duration")
      .populate("userId", "name email phoneNumber")
      .exec();

    if (!bookings.length) {
      return res.status(404).json({
        statusCode: 404,
        message: "No bookings found",
        totalCount: 0,
        data: null,
      });
    }

    return res.status(200).json({
      statusCode: 200,
      message: "All booking details fetched successfully",
      totalCount: bookings.length,
      data: bookings,
    });
  } catch (err) {
    console.error("Error fetching all bookings:", err);
    return res.status(500).json({
      statusCode: 500,
      message: "Internal server error",
      totalCount: 0,
      data: null,
    });
  }
};

export const getTotalTransactionStats = async (req, res) => {
  try {
    const bookings = await PackageBooking.find({ paymentStatus: "completed" }, "totalPrice").exec();

    if (!bookings.length) {
      return res.status(404).json({
        statusCode: 404,
        message: "No completed bookings found",
        totalTransactionValue: 0,
        totalTransactionCount: 0,
        data: null,
      });
    }

    const totalTransactionValue = bookings.reduce(
      (total, booking) => total + booking.totalPrice,
      0
    );

    const totalTransactionCount = bookings.length;

    return res.status(200).json({
      statusCode: 200,
      message: "Total transaction statistics fetched successfully",
      totalTransactionValue,
      totalTransactionCount,
      data: bookings,
    });
  } catch (err) {
    console.error("Error fetching transaction stats:", err);
    return res.status(500).json({
      statusCode: 500,
      message: "Internal server error",
      totalTransactionValue: 0,
      totalTransactionCount: 0,
      data: null,
    });
  }
};
