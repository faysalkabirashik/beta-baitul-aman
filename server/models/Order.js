import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },

    bookTitle: { type: String, required: true },
    quantity: { type: Number, required: true },
    totalPrice: { type: Number, required: true },

    orderType: { type: String, default: "buy" },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
