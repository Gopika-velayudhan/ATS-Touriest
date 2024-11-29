import mongoose from "mongoose";

const VisaSchema = new mongoose.Schema(
    {
      country: {
        type: String,
        required: true,
      },
      visaType: {
        type: String,
        required: true,
        enum: ['Tourist', 'Business', 'Student', 'Work', 'Transit'], 
      },
      visaMode: {
        type: String,
        required: true,
        enum: ['E-Visa', 'Visa on Arrival', 'Regular Visa'], 
      },
      validity: {
        type: String,
        required: true, 
      },
      processingTime: {
        type: String,
        required: true, 
      },
      pricePerPerson: {
        type: Number,
        required: true,
        min: 0,
      },
      maxStay: {
        type: String,
        required: true,
      },
      requirements: [
        {
          type: String,
        },
      ],
      additionalInfo: {
        type: String,
      },
      nationality: {  
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
    },
    {
      timestamps: true,
    }
  );

  const Visa = mongoose.model("Visa",VisaSchema)

  export default Visa
  