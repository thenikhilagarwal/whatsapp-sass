import express from "express";
import axios from "axios";
import Message from "../models/messageSchema.js";

const router = express.Router();

router.post("/send", async (req, res) => {
  const { number, msg } = req.body;

  if (!number || !msg) {
    return res.status(400).json({ error: "Number and message are required" });
  }

  const url = `https://graph.facebook.com/v19.0/${process.env.PHONE_NUMBER_ID}/messages`;
  
  // Decide if we should send a template or text based on the message content
  // For the sake of the tutorial/test, if msg is exactly "template", we send a template.
  // Otherwise we send text. However, remember the 24-hour rule. Let's try sending text directly.
  const data = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: number,
    type: "text",
    text: { body: msg }
  };

  try {
    const response = await axios.post(url, data, {
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
        "Content-Type": "application/json",
      }
    });

    // Save outgoing message sent from dashboard
    try {
      await Message.create({
        sender: process.env.PHONE_NUMBER_ID,
        receiver: number,
        message: msg,
        isAI: false
      });
    } catch (err) {
      console.log("Failed to save outgoing message to DB:", err.message);
    }

    res.json({ success: true, data: response.data });
  } catch (error) {
    console.error("❌ Failed to send message.");
    console.error(error.response ? JSON.stringify(error.response.data, null, 2) : error.message);
    const errorMessage = error.response?.data?.error?.message || "Failed to send message";
    res.status(500).json({ error: errorMessage, details: error.response?.data || error.message });
  }
});


router.get("/history", async (req, res) => {
  try {
    const messages = await Message.find().sort({ timestamp: 1 });
    res.json({ success: true, data: messages });
  } catch (error) {
    console.error("❌ Failed to fetch messages:", error);
    res.status(500).json({ error: "Failed to fetch messages", details: error.message });
  }
});

router.get("/history/:number", async (req, res) => {
  try {
    const { number } = req.params;
    // Find messages where the number is either sender or receiver
    const messages = await Message.find({
      $or: [{ sender: number }, { receiver: number }]
    }).sort({ timestamp: 1 });
    res.json({ success: true, data: messages });
  } catch (error) {
    console.error(`❌ Failed to fetch messages for ${req.params.number}:`, error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

export default router;
