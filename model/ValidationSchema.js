import Joi from "joi";

export const userValidationSchema = Joi.object({
  name: Joi.string().required(),

  googleId: Joi.string(),

  email: Joi.string().email().required(),

  address: Joi.string().required(),
  wishlist: Joi.string(),
  cart : Joi.string(),

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
  duration: Joi.number().required(),
  durationType: Joi.string().valid('hours', 'days').required(),
  price: Joi.number().min(0).required(),
  images: Joi.array().items(Joi.string().uri()),
  date: Joi.date().required(),
  includedActivities: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)), 
  country: Joi.string().trim().required(),
  city: Joi.string().trim().required(),
  customerType: Joi.string().valid('general', 'vip', 'exclusive').required(),
  highlights: Joi.array().items(Joi.string()).required(),
  included: Joi.array().items(Joi.string()).required(),
  excluded: Joi.array().items(Joi.string()).required(),
  faqs: Joi.array().items(
    Joi.object({
      question: Joi.string().required(),
      answer: Joi.string().required(),
    })
  ),
  goodToKnow: Joi.array().items(
    Joi.object({
      label: Joi.string().required(),
      answer: Joi.string().required(),
    })
  ),
  itinerary: Joi.array().items(
    Joi.object({
      label: Joi.string().required(),
      heading: Joi.string().required(),
      answer: Joi.string().required(),
    })
  ),
  availableSeats: Joi.number().min(0),
  reviews: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)), 
  overallRating: Joi.number().min(0).max(5), 
});
const PricingSchema = Joi.object({
  adult: Joi.number().required().min(0),
  child: Joi.number().required().min(0),
  infant: Joi.number().required().min(0),
});

// Joi Schema for Extra Services
const ExtraServiceSchema = Joi.object({
  extraServiceName: Joi.string().required(),
  pricing: PricingSchema.required(),
});

// Joi Schema for Variations
const VariationSchema = Joi.object({
  variationName: Joi.string().required(),
  extraService: Joi.array().items(ExtraServiceSchema).required(),
});

// Joi Schema for Location
const LocationSchema = Joi.object({
  country: Joi.string().required(),
  state: Joi.string().required(),
  city: Joi.string().required(),
});

// Joi Schema for Activity
export const activityValidationSchema = Joi.object({
  name: Joi.string().required(),
  category: Joi.string().required(),
  variations: Joi.array().items(VariationSchema).required(),
  images: Joi.array().items(Joi.string().uri()).required(),
  location: LocationSchema.required(),
  reviews: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)), 
  overallRating: Joi.number().min(0).max(5).default(0),
});
export const joiReviewSchema = Joi.object({
  user: Joi.string().required(),
  package: Joi.string().optional(),
  activity: Joi.string().optional(),
  visa :Joi.string().optional(),
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

export const visaValidationSchema = Joi.object({
  country: Joi.string(),
  nationality: Joi.string(),
  living: Joi.array().items(Joi.string()),
  image: Joi.string().uri(), 
  price: Joi.number().min(0),
  processingType:Joi.array().items(Joi.string()),
  
  travelDate: Joi.date().iso(),
  visaType: Joi.string()
    .valid("Tourist", "Business", "Student", "Work", "Transit")
    ,
  visaMode: Joi.string()
    .valid("E-Visa", "Visa on Arrival", "Regular Visa")
    ,
  validity: Joi.string(),
  maxStay: Joi.string(),
  processingTime: Joi.string(),
  pricePerPerson: Joi.number().min(0),
  requirements: Joi.array().items(Joi.string()),
  additionalInfo: Joi.string().optional(),
  travelerNumber: Joi.number().min(1),
  createdAt: Joi.date().optional(),
  updatedAt: Joi.date().optional(),
  reviews: Joi.string(),
});


export const cartItemValidationSchema = Joi.object({
  itemId: Joi.string().required(), 
  itemType: Joi.string()
    .valid("Package", "Activity", "Visa")
    .required(),
 
  price: Joi.number().min(0).required(),
});

export const cartValidationSchema = Joi.object({
  userId: Joi.string().required(), 
  items: Joi.array().items(cartItemValidationSchema).min(1).required(),
  totalPrice: Joi.number().min(0).required(),
  updatedAt: Joi.date(),
});
