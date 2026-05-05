const Razorpay = require("razorpay");
const crypto = require("crypto");
const Order = require("./models/Order");

const parsePrice = (value) => {
  if (typeof value === "number") return value;
  if (!value) return 0;

  const match = String(value).replace(/,/g, "").match(/\d+(\.\d+)?/);
  return match ? Number(match[0]) : 0;
};

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

function cleanItems(items = []) {
  return items.map((item) => ({
    productId: String(item.productId || item._id || item.id || ""),
    name: String(item.name || "Product"),
    category: String(item.category || ""),
    image: String(item.image || item.images?.[0] || ""),
    price: parsePrice(item.price),
    quantity: Math.max(1, Number(item.quantity || 1)),
  }));
}

async function createOrderHandler(req, res) {
  try {
    const { amount } = req.body || {};
    const finalAmount = parsePrice(amount);

    if (!finalAmount || finalAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid amount is required",
      });
    }

    const razorpay = createRazorpayClient();

    const order = await razorpay.orders.create({
      amount: Math.round(finalAmount * 100),
      currency: "INR",
      receipt: `MHC_${Date.now()}`,
      payment_capture: 1,
    });

    return res.status(200).json({
      success: true,
      keyId: process.env.RAZORPAY_KEY_ID,
      order,
    });
  } catch (error) {
    console.error("Create Razorpay order error:", error);

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
      customer = {},
      items = [],
      total,
      totalAmount,
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

    const cleanedItems = cleanItems(items);

    if (!cleanedItems.length) {
      return res.status(400).json({
        success: false,
        message: "No order items found",
      });
    }

    const calculatedTotal = cleanedItems.reduce((sum, item) => {
      return sum + item.price * item.quantity;
    }, 0);

    const finalTotal = parsePrice(totalAmount || total) || calculatedTotal;

    const newOrder = await Order.create({
      customer: {
        name: customer.name || "",
        email: customer.email || "",
        phone: customer.phone || "",
        address: customer.address || "",
        city: customer.city || "",
        state: customer.state || "",
        pincode: customer.pincode || "",
      },
      items: cleanedItems,
      totalAmount: finalTotal,
      paymentMethod: "Razorpay",
      paymentStatus: "Paid",
      orderStatus: "Pending",
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
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

async function codOrderHandler(req, res) {
  try {
    const { customer = {}, items = [], total, totalAmount } = req.body || {};

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Customer and items are required",
      });
    }

    const cleanedItems = cleanItems(items);

    const calculatedTotal = cleanedItems.reduce((sum, item) => {
      return sum + item.price * item.quantity;
    }, 0);

    const finalTotal = parsePrice(totalAmount || total) || calculatedTotal;

    const newOrder = await Order.create({
      customer: {
        name: customer.name || "",
        email: customer.email || "",
        phone: customer.phone || "",
        address: customer.address || "",
        city: customer.city || "",
        state: customer.state || "",
        pincode: customer.pincode || "",
      },
      items: cleanedItems,
      totalAmount: finalTotal,
      paymentMethod: "COD",
      paymentStatus: "Pending",
      orderStatus: "Pending",
    });

    return res.status(200).json({
      success: true,
      message: "COD order placed successfully",
      order: newOrder,
    });
  } catch (error) {
    console.error("COD order error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to place COD order",
    });
  }
}

async function paymentLinkCallbackHandler(req, res) {
  return res.redirect("/order-success");
}

module.exports = {
  createOrderHandler,
  paymentSuccessHandler,
  codOrderHandler,
  paymentLinkCallbackHandler,
};