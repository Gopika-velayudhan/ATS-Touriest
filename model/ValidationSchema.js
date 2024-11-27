import Joi from "joi";

export const userValidationSchema = Joi.object({
  name: Joi.string().required(),

  googleId:Joi.string(),

  email: Joi.string().email().required(),

  address: Joi.string().required(),

  password: Joi.string().min(6).required(),
  isVerified: Joi.boolean().optional().default(false),
  isActive: Joi.boolean().optional().default(true),
  isBlocked: Joi.boolean().optional().default(false),

  phoneNumber: Joi.string()
    .pattern(/^\+?[1-9]\d{1,14}$/)
    .required(),
  image: Joi.string()
    .uri()
    .optional()
    .default(
      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
    ),
});

export const packageValidationSchema = Joi.object({
  name: Joi.string().trim().required(),

  description: Joi.string().trim().required(),

  price: Joi.number().min(0).required(),

  destination: Joi.string().trim().required(),

  startDate: Joi.date().required(),

  endDate: Joi.date().greater(Joi.ref("startDate")).required(),

  images: Joi.array().items(Joi.string().uri()),
  includedActivities: Joi.array().items(Joi.string().hex()),
  includedHotels: Joi.array().items(Joi.string().hex()),

  availableSeats: Joi.number().min(0).required(),
  review: Joi.string(),
});

export const activityValidationSchema = Joi.object({
  name: Joi.string().trim().required(),

  description: Joi.string().trim().required(),
  duration: Joi.string().trim().required(),
  price: Joi.number().min(0).required(),
  images: Joi.array().items(Joi.string().uri()),

  date: Joi.date().required(),
  reviews: Joi.string(),
});

export const joiReviewSchema = Joi.object({
  user: Joi.string().required(),
  package: Joi.string().optional(),
  activity: Joi.string().optional(),
  rating: Joi.number().min(1).max(5).required(),
  reviewText: Joi.string().min(10).required(),
});

export const packageBookingValidationSchema = Joi.object({
  userId: Joi.string().optional(),

  packageId: Joi.string().trim().required(),

  activityIds: Joi.array().items(Joi.string()).optional(),

  bookingDate: Joi.date().optional(),

  checkInTime: Joi.date().required().messages({
    "any.required": "Check-in time is required.",
  }),

  checkOutTime: Joi.date().required().greater(Joi.ref("checkInTime")).messages({
    "any.required": "Check-out time is required.",
    "date.greater": "Check-out time must be after check-in time.",
  }),

  numberOfSeats: Joi.number().integer().min(1).required().messages({
    "any.required": "Number of seats is required.",
    "number.min": "Number of seats must be at least 1.",
  }),

  totalPrice: Joi.number().min(0).required().messages({
    "any.required": "Total price is required.",
    "number.min": "Total price must be at least 0.",
  }),

  paymentStatus: Joi.string()
    .valid("pending", "completed", "failed")
    .default("pending"),

  paymentMethod: Joi.string()
    .valid("credit_card", "debit_card", "paypal", "razorpay")
    .required()
    .messages({
      "any.required": "Payment method is required.",
    }),

  status: Joi.string()
    .valid("pending", "confirmed", "cancelled", "completed")
    .default("pending"),

  specialRequests: Joi.string().optional(),

  cancellationPolicy: Joi.string().optional(),

  cancellationFee: Joi.number().min(0).default(0),

  refundable: Joi.boolean().default(true).optional(),

  bookingReferenceId: Joi.string(),

  additionalServices: Joi.array().items(Joi.string()).optional(),
});
