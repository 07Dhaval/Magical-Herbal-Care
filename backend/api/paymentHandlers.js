const Razorpay = require("razorpay");
const crypto = require("crypto");

function normalizeCredential(value) {
  return String(value || "")
    .trim()
    .replace(/^['"]|['"]$/g, "")
    .replace(/\s+/g, "");
}

function getRazorpayClient() {
  const keyId = normalizeCredential(process.env.RAZORPAY_KEY_ID);
  const keySecret = normalizeCredential(process.env.RAZORPAY_KEY_SECRET);

  if (!keyId || !keySecret) {
    throw new Error("Missing Razorpay credentials in environment variables.");
  }

  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
}

async function createOrderHandler(req, res) {
  try {
    const { amount } = req.body || {};

    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid amount is required",
      });
    }

    const razorpay = getRazorpayClient();
    const order = await razorpay.orders.create({
      amount: Math.round(Number(amount) * 100),
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    return res.status(200).json({
      success: true,
      keyId: normalizeCredential(process.env.RAZORPAY_KEY_ID),
      order,
    });
  } catch (error) {
    console.error("Create order error:", error);
    return res.status(500).json({
      success: false,
      message:
        error?.error?.description ||
        error?.message ||
        "Failed to create Razorpay order",
    });
  }
}

async function paymentSuccessHandler(req, res) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      customer,
      items,
      total,
    } = req.body || {};

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Missing payment details",
      });
    }

    const keySecret = normalizeCredential(process.env.RAZORPAY_KEY_SECRET);
    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }

    console.log("Payment verified successfully");
    console.log({
      razorpay_order_id,
      razorpay_payment_id,
      customer,
      items,
      total,
    });

    return res.status(200).json({
      success: true,
      message: "Payment verified and order saved successfully",
    });
  } catch (error) {
    console.error("Payment success error:", error);
    return res.status(500).json({
      success: false,
      message: error?.message || "Failed to verify payment",
    });
  }
}

module.exports = {
  createOrderHandler,
  paymentSuccessHandler,
};
