import mongoose from "mongoose";

const PricingSchema = new mongoose.Schema({
  adult: { type: Number, required: true },
  child: { type: Number, required: true },
  infant: { type: Number, required: true },
});

const ExtraServiceSchema = new mongoose.Schema({
  extraServiceName: { type: String, required: true },
  pricing: { type: PricingSchema, required: true },
});


const VariationSchema = new mongoose.Schema({
  variationName: { type: String, required: true },
  extraService: { type: [ExtraServiceSchema], required: true },
});

const LocationSchema = new mongoose.Schema({
  country: { type: String, required: true },
  state: { type: String, required: true },
  city: { type: String, required: true },
});

const ActivitySchema = new mongoose.Schema(
  {

    name: { type: String, required: true },
    category: { type: String, required: true },
    variations: { type: [VariationSchema], required: true },
    images: { type: [String], required: true },
    location: { type: LocationSchema, required: true },
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

const Activity = mongoose.model("Activity", ActivitySchema);

export default Activity;
