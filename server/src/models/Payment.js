import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    plan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plan",
      required: true
    },

    amount: {
      type: Number,
      required: true
    },

    currency: {
      type: String,
      default: "USD"
    },

    credits: {
      type: Number,
      required: true 
    },

    paymentProvider: {
      type: String,
      enum: ["stripe", "sslcommerz", "paypal", "manual"],
      default: "stripe" 
    },

    
    stripeSessionId: {
      type: String,
      unique: true,
      sparse: true 
    },

    transactionId: {
      type: String,
      unique: true,
      sparse: true
    },

    status: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
      index: true
    },

    paidAt: {
      type: Date
    },

    failureReason: {
      type: String
    },

    
    metadata: {
      type: Object
    }
  },
  { timestamps: true }
);


PaymentSchema.index({ user: 1, createdAt: -1 });

export default mongoose.model("Payment", PaymentSchema);