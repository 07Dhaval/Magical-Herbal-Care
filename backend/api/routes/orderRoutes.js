const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

// SAVE COD / RAZORPAY ORDER
router.post("/payment-success", async (req, res) => {
  try {
    console.log("ORDER BODY:", req.body);

    const {
      customer = {},
      items = [],
      totalAmount = 0,
      paymentMethod = "COD",
      paymentStatus = "Pending",
      orderStatus = "Pending",
      razorpayOrderId = "",
      razorpayPaymentId = "",
      razorpaySignature = "",
    } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No order items found",
      });
    }

    const cleanedItems = items.map((item) => ({
      productId: String(item.productId || item._id || item.id || ""),
      name: String(item.name || "Product"),
      image: String(item.image || ""),
      price: Number(item.price || 0),
      quantity: Number(item.quantity || 1),
    }));

    const order = await Order.create({
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

      totalAmount: Number(totalAmount || 0),

      paymentMethod:
        paymentMethod === "Razorpay" ? "Razorpay" : "COD",

      paymentStatus:
        paymentStatus === "Paid" ? "Paid" : "Pending",

      orderStatus:
        ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"].includes(
          orderStatus
        )
          ? orderStatus
          : "Pending",

      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    });

    return res.status(201).json({
      success: true,
      message: "Order saved successfully",
      order,
    });
  } catch (error) {
    console.error("ORDER SAVE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
      error,
    });
  }
});

// GET ALL ORDERS
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("FETCH ORDERS ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch orders",
    });
  }
});

module.exports = router;