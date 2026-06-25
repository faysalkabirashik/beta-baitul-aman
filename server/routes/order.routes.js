import express from "express";
import { supabase } from "../index.js";

const router = express.Router();

/**
 * POST /api/orde
 */
router.post("/", async (req, res) => {
  try {
    const { name, phone, address, bookTitle, quantity, totalPrice, orderType } = req.body;
    
    const { error } = await supabase
      .from("orders")
      .insert([{
        name,
        phone,
        address,
        book_title: bookTitle,
        quantity,
        total_price: totalPrice,
        order_type: orderType || "buy"
      }]);

    if (error) throw error;

    res.status(201).json({
      success: true,
      message: "Order saved to Supabase",
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
