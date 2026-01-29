import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    productName: {
      type: String,
      default: "নূরানী পদ্ধতিতে পবিত্র কুরআন ও দ্বীন শিক্ষা",
    },
    price: {
      type: Number,
      default: 250,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
