import express from "express";
import Order from "../models/Order.js";

const router = express.Router();

/**
 * POST /api/order
 */
router.post("/", async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();

    res.status(201).json({
      success: true,
      message: "Order saved to MongoDB",
    });
  } catch (err) {
    console.error("Order save error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to save order",
    });
  }
});

export default router;
