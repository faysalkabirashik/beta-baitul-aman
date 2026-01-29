import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import joinRoutes from "./routes/join.routes.js";
import orderRoutes from "./routes/order.routes.js";
import authRoutes from "./routes/auth.routes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/join", joinRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/auth", authRoutes);



mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.get("/", (req, res) => {
  res.send("Baitul Aman API running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
