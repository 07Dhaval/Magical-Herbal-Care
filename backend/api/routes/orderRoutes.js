const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

const parsePrice = (value) => {
  if (typeof value === "number") return value;
  if (!value) return 0;

  const match = String(value).replace(/,/g, "").match(/\d+(\.\d+)?/);
  return match ? Number(match[0]) : 0;
};

const cleanOrderStatus = (status) => {
  const allowed = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
  return allowed.includes(status) ? status : "Pending";
};

const cleanPaymentStatus = (status) => {
  const allowed = ["Pending", "Paid", "Failed", "Refunded"];
  return allowed.includes(status) ? status : "Pending";
};

const cleanPaymentMethod = (method) => {
  return method === "Razorpay" ? "Razorpay" : "COD";
};

const cleanCustomer = (customer = {}) => ({
  name: String(customer.name || "").trim(),
  email: String(customer.email || "").trim().toLowerCase(),
  phone: String(customer.phone || "").trim(),
  address: String(customer.address || "").trim(),
  city: String(customer.city || "").trim(),
  state: String(customer.state || "").trim(),
  pincode: String(customer.pincode || "").trim(),
});

const cleanItems = (items = []) => {
  return items
    .map((item) => {
      const price = parsePrice(item.price);
      const quantity = Math.max(1, Number(item.quantity || 1));

      return {
        productId: String(item.productId || item._id || item.id || ""),
        name: String(item.name || "Product").trim(),
        category: String(item.category || "").trim(),
        image: String(item.image || item.images?.[0] || ""),
        price,
        quantity,
      };
    })
    .filter((item) => item.name && item.price >= 0);
};

// SAVE COD / RAZORPAY ORDER
router.post("/payment-success", async (req, res) => {
  try {
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

    const cleanedItems = cleanItems(items);

    if (cleanedItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid order items",
      });
    }

    const calculatedTotal = cleanedItems.reduce((sum, item) => {
      return sum + item.price * item.quantity;
    }, 0);

    const finalTotal = parsePrice(totalAmount) || calculatedTotal;

    const finalPaymentMethod = cleanPaymentMethod(paymentMethod);
    const finalPaymentStatus =
      finalPaymentMethod === "Razorpay"
        ? cleanPaymentStatus(paymentStatus || "Paid")
        : cleanPaymentStatus(paymentStatus || "Pending");

    const order = await Order.create({
      customer: cleanCustomer(customer),
      items: cleanedItems,
      totalAmount: finalTotal,

      paymentMethod: finalPaymentMethod,
      paymentStatus: finalPaymentStatus,
      orderStatus: cleanOrderStatus(orderStatus),

      razorpayOrderId: String(razorpayOrderId || ""),
      razorpayPaymentId: String(razorpayPaymentId || ""),
      razorpaySignature: String(razorpaySignature || ""),
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
      message: error.message || "Order save failed",
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

// GET SINGLE ORDER
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("FETCH ORDER ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch order",
    });
  }
});

// UPDATE ORDER STATUS
router.put("/:id/status", async (req, res) => {
  try {
    const { orderStatus } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus: cleanOrderStatus(orderStatus) },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.json({
      success: true,
      message: "Order status updated",
      order,
    });
  } catch (error) {
    console.error("UPDATE ORDER STATUS ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Failed to update order status",
    });
  }
});

// UPDATE ORDER FALLBACK
router.put("/:id", async (req, res) => {
  try {
    const { orderStatus, paymentStatus } = req.body;

    const updateData = {};

    if (orderStatus) updateData.orderStatus = cleanOrderStatus(orderStatus);
    if (paymentStatus) updateData.paymentStatus = cleanPaymentStatus(paymentStatus);

    const order = await Order.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.json({
      success: true,
      message: "Order updated",
      order,
    });
  } catch (error) {
    console.error("UPDATE ORDER ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Failed to update order",
    });
  }
});

module.exports = router;