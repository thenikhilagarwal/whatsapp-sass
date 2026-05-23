import express from "express";
import WhatsAppAccount from "../models/waSchema.js";
import Message from "../models/messageSchema.js";
import axios from "axios";
import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

// Webhook Verification
router.get("/", (req, res) => {
    let mode = req.query["hub.mode"];
    let token = req.query["hub.verify_token"];
    let challenge = req.query["hub.challenge"];

    if (mode && token) {
        if (mode === "subscribe" && token === process.env.VERIFY_TOKEN) {
            console.log("WEBHOOK_VERIFIED");
            res.status(200).send(challenge);
        } else {
            res.sendStatus(403);
        }
    } else {
        res.status(200).send("Webhook endpoint is working");
    }
});

// Receive Webhook
router.post("/", async (req, res) => {
    try {
        const entry = req.body.entry?.[0];
        const changes = entry?.changes?.[0];
        const value = changes?.value;

        // 1 & 2. Ignore status updates (like delivered/read) and non-message events
        if (value?.statuses || !value?.messages) {
            return res.sendStatus(200); 
        }

        const message = value.messages[0];
        const phone_number_id = value.metadata?.phone_number_id;

        // 3. Ensure only real user messages trigger AI responses (text only)
        if (message.type !== "text" || !message.text?.body) {
            return res.sendStatus(200);
        }

        // Prevent bot from replying to its own outgoing messages if they are echoed back
        if (message.from === value.metadata?.display_phone_number) {
            return res.sendStatus(200);
        }

        // 4. Duplicate message protection using message IDs
        const messageId = message.id;
        const existingMessage = await Message.findOne({ messageId });
        if (existingMessage) {
            console.log("Duplicate message ignored:", messageId);
            return res.sendStatus(200);
        }

        // 5. Best Practice: Acknowledge webhook immediately before processing AI.
        // This prevents Meta from retrying the webhook due to timeouts.
        res.sendStatus(200);

        // --- Background Processing ---
        (async () => {
            try {
                // Try to find the user's account to see if they're registered
                let account = null;
                try {
                    account = await WhatsAppAccount.findOne({ phone_number_id });
                } catch (dbErr) {
                    console.log("DB lookup failed:", dbErr.message);
                }

                const userMessage = message.text.body;
                console.log("Received message:", userMessage);

                // Save incoming message
                await Message.create({
                    messageId: messageId,
                    sender: message.from,
                    receiver: phone_number_id,
                    message: userMessage,
                    isAI: false
                });

                // Generate AI Reply
                const aiRes = await axios.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
                    contents: [{ parts: [{ text: userMessage }] }]
                });

                const reply = aiRes.data.candidates[0].content.parts[0].text;
                console.log("AI Reply:", reply);

                const tokenToUse = account?.access_token || process.env.WHATSAPP_TOKEN;
                const phoneIdToUse = account?.phone_number_id || process.env.PHONE_NUMBER_ID || phone_number_id;

                // Send AI Reply to WhatsApp
                const sendRes = await axios.post(
                    `https://graph.facebook.com/v19.0/${phoneIdToUse}/messages`,
                    {
                        messaging_product: "whatsapp",
                        recipient_type: "individual",
                        to: message.from,
                        type: "text",
                        text: { body: reply },
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${tokenToUse}`,
                        },
                    }
                );

                // Save outgoing message
                const replyMessageId = sendRes.data?.messages?.[0]?.id || `out-${Date.now()}`;
                await Message.create({
                    messageId: replyMessageId,
                    sender: phone_number_id,
                    receiver: message.from,
                    message: reply,
                    isAI: true
                });

            } catch (bgErr) {
                console.error("Error in background processing:", bgErr?.response?.data || bgErr.message);
            }
        })();

    } catch (err) {
        console.error("Error processing webhook:", err?.response?.data || err.message);
        // If we haven't sent headers yet, send a 500
        if (!res.headersSent) {
            res.status(500).send(err?.response?.data || err.message);
        }
    }
});

export default router;
