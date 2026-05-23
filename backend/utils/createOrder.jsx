import Razorpay from "razorpay";
import dotenv from "dotenv";
dotenv.config();

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY,
    key_secret: process.env.RAZORPAY_SECRET,
});

export const createOrder = async (req, res) => {
    const options = {
        amount: 49900, // ₹499
        currency: "INR",
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
};