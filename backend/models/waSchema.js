import mongoose from "mongoose";

const waSchema = new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    phone_number_id: String,
    access_token: String,
});

export default mongoose.model("WhatsAppAccount", waSchema); 