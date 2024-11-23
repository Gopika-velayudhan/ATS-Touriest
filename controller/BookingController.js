import PackageBooking from "../model/BookingSchema.js";
import { packageBookingValidationSchema } from "../model/ValidationSchema.js";
import Package from "../model/PackageSchema.js";
import User from "../model/AuthSchema.js";

export const createBooking = async (req, res) => {
    
  const { value, error } = packageBookingValidationSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      statusCode: 400,
      message: error.details,
      data: null,
    });
  }

  try {
    const newBooking = new PackageBooking({
      ...value,
      userId: req.user.userId,
    });

    const savedBooking = await newBooking.save();

    return res.status(201).json({
      statusCode: 201,
      message: "Package booked successfully",
      bookingId: savedBooking._id,
      data: savedBooking,
    });
  } catch (err) {
    return res.status(500).json({
      statusCode: 500,
      message: err.message,
      data: null,
    });
  }
};


export const getBookingHistory = async (req, res) => {
    const { userId } = req.user;

 

    try {
        const bookings = await PackageBooking.find({ userId })
            .populate("packageId", "name description price")
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
      .populate("userId", "firstName lastName email phoneNumber") 
      .exec();

    if (!bookings.length) {
      return res.status(404).json({
        statusCode: 404,
        message: "No bookings found",
        data: null,
      });
    }

    return res.status(200).json({
      statusCode: 200,
      message: "All booking details fetched successfully",
      data: bookings,
    });
  } catch (err) {
    return res.status(500).json({
      statusCode: 500,
      message: "Internal server error",
      data: null,
    });
  }
};

