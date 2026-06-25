import express from "express";
import { supabase } from "../index.js";

const router = express.Router();

/**
 * POST /api/join
 */
router.post("/", async (req, res) => {
  try {
    const { name, phone, email, address } = req.body;
    
    const { error } = await supabase
      .from("joins")
      .insert([{ name, phone, email, address }]);

    if (error) throw error;

    res.status(201).json({
      success: true,
      message: "Join data saved to Supabase",
    });
  } catch (err) {
    console.error("Join save error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to save join data",
    });
  }
});

export default router;
