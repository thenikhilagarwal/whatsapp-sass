import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import webhookRoutes from "./routes/webhook.js";
import authRoutes from "./routes/auth.js";
import messageRoutes from "./routes/message.js";
import { protect } from "./middleware/authMiddleware.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/webhook", webhookRoutes);
app.use("/api/auth", authRoutes);
app.use("/api", protect, messageRoutes);

app.get("/", (req, res) => {
    res.send("WhatsApp SaaS Backend is running!");
});

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("DB Connected"))
    .catch(err => console.error("DB Connection Error:", err.message));

app.listen(5000, () => console.log("Server running"));