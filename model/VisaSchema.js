import mongoose from "mongoose";

const VisaSchema = new mongoose.Schema(
  {
    country: {
      type: String,
    
    },
    nationality: {
      type: String,
      
    },

    living: {
      type: [String],

      required: true,
    },
    image: {
      type: String,
      
    },
    price: {
      type: Number,
      
      min: 0,
    },
    processingType: {
      type: [String],

      
    },
    travelDate: {
      type: Date,
      
    },
    visaType: {
      type: String,
    
      enum: ["Tourist", "Business", "Student", "Work", "Transit"],
    },
    visaMode: {
      type: String,
      
      enum: ["E-Visa", "Visa on Arrival", "Regular Visa"],
    },
    validity: {
      type: String,
      
    },
    processingTime: {
      type: String,
    
    },
    pricePerPerson: {
      type: Number,
    
      min: 0,
    },
    maxStay: {
      type: String,
      
    },
    requirements: [
      {
        type: String,
      },
    ],
    additionalInfo: {
      type: String,
    },
    travelerNumber: {
      type: Number,
      min: 1,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },

    reviews: [{ type: mongoose.Schema.ObjectId, ref: "Review" }],
    overallRating: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Visa = mongoose.model("Visa", VisaSchema);

export default Visa;
