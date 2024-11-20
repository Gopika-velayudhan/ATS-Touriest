import mongoose from 'mongoose';

const ActivitySchema = new mongoose.Schema(
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
    duration: {
      type: String, 
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    date: {
      type: Date, 
      required: true,
    },
  },
  {
    timestamps: true, 
  }
);

const Activity = mongoose.model('Activity', ActivitySchema);

export default Activity;
