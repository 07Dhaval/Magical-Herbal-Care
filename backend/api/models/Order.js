const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
      index: true,
    },

    customer: {
      name: { type: String, default: "" },
      email: { type: String, default: "" },
      phone: { type: String, default: "" },
      address: { type: String, default: "" },
      city: { type: String, default: "" },
      state: { type: String, default: "" },
      pincode: { type: String, default: "" },
    },

    items: [
      {
        productId: { type: String, default: "" },
        name: { type: String, default: "Product" },
        image: { type: String, default: "" },
        price: { type: Number, default: 0 },
        quantity: { type: Number, default: 1 },
      },
    ],

    totalAmount: {
      type: Number,
      required: true,
      default: 0,
    },

    paymentMethod: {
      type: String,
      enum: ["Razorpay", "COD"],
      default: "COD",
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed", "Refunded"],
      default: "Pending",
    },

    orderStatus: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },

    razorpayOrderId: {
      type: String,
      default: "",
    },

    razorpayPaymentId: {
      type: String,
      default: "",
    },

    razorpaySignature: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// ✅ FIXED HOOK (this was causing 500 error)
orderSchema.pre("save", function (next) {
  if (!this.orderNumber) {
    const random = Math.floor(1000 + Math.random() * 9000);
    this.orderNumber = `MHC-${Date.now()}-${random}`;
  }

  next(); // IMPORTANT
});

module.exports =
  mongoose.models.Order || mongoose.model("Order", orderSchema);