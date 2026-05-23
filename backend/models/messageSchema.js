import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    messageId: { type: String, unique: true, sparse: true },
    sender: { type: String, required: true },
    receiver: { type: String, required: true },
    message: { type: String, required: true },
    isAI: { type: Boolean, default: false },
    timestamp: { type: Date, default: Date.now },
});

export default mongoose.model("Message", messageSchema);
