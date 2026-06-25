import express from "express";
import { createClient } from "@supabase/supabase-js";
import cors from "cors";
import dotenv from "dotenv";
import joinRoutes from "./routes/join.routes.js";
import orderRoutes from "./routes/order.routes.js";

dotenv.config();

// Initialize Supabase Client
export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/join", joinRoutes);
app.use("/api/order", orderRoutes);

app.get("/", (req, res) => {
  res.send("Baitul Aman API running on Supabase");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
