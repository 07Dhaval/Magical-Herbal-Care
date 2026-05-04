const express = require("express");
const Razorpay = require("razorpay");

const router = express.Router();

let razorpayInstance = null;

const getRazorpayInstance = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error("Razorpay keys not configured in backend .env");
  }

  if (!razorpayInstance) {
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }

  return razorpayInstance;
};

const parseAmount = (amount) => {
  if (typeof amount === "number") return amount;

  const match = String(amount || "")
    .replace(/,/g, "")
    .match(/\d+(\.\d+)?/);

  return match ? Number(match[0]) : 0;
};

// CREATE RAZORPAY ORDER
router.post("/create-order", async (req, res) => {
  try {
    const amount = parseAmount(req.body.amount);

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid amount",
      });
    }

    const razorpay = getRazorpayInstance();

    const options = {
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: `MHC_${Date.now()}`,
      payment_capture: 1,
    };

    const order = await razorpay.orders.create(options);

    return res.status(201).json({
      success: true,
      order,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Create Razorpay order error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create Razorpay order",
    });
  }
});

module.exports = router;