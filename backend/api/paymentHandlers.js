const Razorpay = require("razorpay");
const crypto = require("crypto");
const Order = require("./models/Order");

function getCredentialSet() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error("Missing Razorpay credentials");
  }

  return { keyId, keySecret };
}

function createRazorpayClient() {
  const { keyId, keySecret } = getCredentialSet();

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

    const razorpay = createRazorpayClient();

    const order = await razorpay.orders.create({
      amount: Math.round(Number(amount) * 100),
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    return res.status(200).json({
      success: true,
      keyId: process.env.RAZORPAY_KEY_ID,
      order,
    });
  } catch (error) {
    console.error("Create order error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create Razorpay order",
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

    const { keySecret } = getCredentialSet();

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

    const newOrder = await Order.create({
      customer,
      items,
      total,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      paymentStatus: "paid",
      status: "paid",
    });

    return res.status(200).json({
      success: true,
      message: "Payment verified and order saved",
      order: newOrder,
    });
  } catch (error) {
    console.error("Payment success error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to verify payment",
    });
  }
}

async function paymentLinkCallbackHandler(req, res) {
  return res.redirect("/order-success");
}

module.exports = {
  createOrderHandler,
  paymentSuccessHandler,
  paymentLinkCallbackHandler,
};