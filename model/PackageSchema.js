import mongoose from 'mongoose';
import Activity from './ActivitySchema.js'


const PackageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    destination: {
      type: String,
      required: true,
      trim: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    images: [{
        type: String
    }],
    includedActivities: [
        {
          type: mongoose.Types.ObjectId,
          ref: 'Activity', 
          
        },
      ],

      
    availableSeats: {
      type: Number,
      required: true,
      min: 0,
    },
    createdAt: {
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


const Package = mongoose.model('Package', PackageSchema);

export default Package;
