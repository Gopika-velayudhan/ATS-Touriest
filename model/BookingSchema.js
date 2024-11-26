import mongoose from "mongoose";

const PackageBookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    packageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Package",
      required: true,
    },
    activityIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Activity",
      },
    ],
    bookingDate: {
      type: Date,
      default: Date.now,
    },
    checkInTime: {
      type: Date,
      required: true, 
    },
    checkOutTime: {
      type: Date,
      required: true,
    },
    numberOfSeats: {
      type: Number,
      required: true,
      min: 1,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["credit_card", "debit_card", "paypal", "razorpay"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },
    specialRequests: {
      type: String,
    },
    cancellationPolicy: {
      type: String,
    },
    cancellationFee: {
      type: Number,
      default: 0,
    },
    refundable: {
      type: Boolean,
      default: true,
    },
    bookingReferenceId: {
      type: String,
      
    },
    additionalServices: {
      type: [String], 
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const PackageBooking = mongoose.model("PackageBooking", PackageBookingSchema);

export default PackageBooking;
