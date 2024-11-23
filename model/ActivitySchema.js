import mongoose from 'mongoose';

const ActivitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      
    },
    description: {
      type: String,
      required: true,
      
    },
    duration: {
      type: String, 
      required: true,
    },
    price: {
      type: Number,
      required: true,
      
    },

    images: [{
        type: String
    }],
    
    date: {
      type: Date, 
      required: true,
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

const Activity = mongoose.model('Activity', ActivitySchema);

export default Activity;
