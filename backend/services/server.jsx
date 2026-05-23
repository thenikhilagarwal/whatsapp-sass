import express from "express";
import WhatsAppAccount from "../models/WhatsAppAccount.js";
import axios from "axios";
import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const entry = req.body.entry?.[0];
        const changes = entry?.changes?.[0];
        const message = changes?.value?.messages?.[0];

        if (!message.text?.body) {
            console.log("No text message");
            return res.sendStatus(200);
        }

        const phone_number_id = changes.value.metadata.phone_number_id;
        console.log("PHONE ID:", phone_number_id);

        // Find user
        const account = await WhatsAppAccount.findOne({ phone_number_id });

        if (!account) return res.sendStatus(200);

        const userMessage = message.text.body;
        console.log("MESSAGE:", userMessage);

        // 👉 AI Reply (basic for now)
        const client = new OpenAI({
            apiKey: process.env.GEMINI_API_KEY,
        });

        const aiRes = await client.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: userMessage }],
        });

        const reply = aiRes.choices[0].message.content;

        await axios.post(
            `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`,
            {
                messaging_product: "whatsapp",
                to: message.from,
                text: { body: reply },
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
                },
            }
        );

        res.sendStatus(200);
    } catch (err) {
        console.log("ERROR:", err.response?.data || err.message);
        res.sendStatus(200);
    }
});

export default router;