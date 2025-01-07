import mongoose from 'mongoose';
import Activity from './ActivitySchema.js';

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
    duration: {
      type: Number,
      required: true,
    },
    durationType: {
      type: String,
      enum: ['hours', 'days'],
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    images: [
      {
        type: String,
      },
    ],
    date: {
      type: Date,
      required: true,
    },

    includedActivities: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'Activity', 
        
      },
    ],
    country: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    customerType: {
      type: String,
      enum: ['general', 'vip', 'exclusive'],
      required: true,
    },
    highlights: [
      {
        type: String,
        required: true,
      },
    ],
    included: [
      {
        type: String,
        required: true,
      },
    ],
    excluded: [
      {
        type: String,
        required: true,
      },
    ],
    faqs: [
      {
        question: {
          type: String,
          required: true,
        },
        answer: {
          type: String,
          required: true,
        },
      },
    ],
    goodToKnow: [
      {
        label: {
          type: String,
          required: true,
        },
        answer: {
          type: String,
          required: true,
        },
      },
    ],
    itinerary: [
      {
        label: {
          type: String,
          required: true,
        },
        heading: {
          type: String,
          required: true,
        },
        answer: {
          type: String,
          required: true,
        },
      },
    ],
    availableSeats: {
      type: Number,
      
      min: 0,
    },

    reviews: [{ type: mongoose.Schema.ObjectId, ref: "Review" }],
    overallRating: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, 
  }
);

const Package = mongoose.model('Package', PackageSchema);

export default Package;
