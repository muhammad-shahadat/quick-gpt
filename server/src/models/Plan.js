import mongoose from "mongoose";

const PlanSchema = new mongoose.Schema(
{
  name: {
    type: String,
    enum: ["Basic", "Pro", "Premium"],
    required: true,
    
  },

  slug: {
    type: String,
    required: true,
    unique: true
  },

  price: {
    type: Number,
    required: true
  },

  credits: {
    type: Number,
    required: true
  },

  features: {
    type: [String],
    default: [],
  }

},
{ timestamps: true }
);

export default mongoose.model("Plan", PlanSchema);