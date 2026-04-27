const Order = require("./models/Order"); // 👈 ADD TOP

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

    // ✅ SAVE ORDER IN DATABASE
    const newOrder = new Order({
      customer,
      items,
      total,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      status: "paid",
    });

    await newOrder.save();

    console.log("Order saved in DB");

    return res.status(200).json({
      success: true,
      message: "Payment verified & order saved",
    });
  } catch (error) {
    console.error("Payment success error:", error);
    return res.status(500).json({
      success: false,
      message: error?.message || "Failed to verify payment",
    });
  }
}