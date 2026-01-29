import express from "express";
import Join from "../models/Join.js";

const router = express.Router();

/**
 * POST /api/join
 */
router.post("/", async (req, res) => {
  try {
    const join = new Join(req.body);
    await join.save();

    res.status(201).json({
      success: true,
      message: "Join data saved to MongoDB",
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
