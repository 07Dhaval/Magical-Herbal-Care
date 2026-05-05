const mongoose = require("mongoose");

const parseNumber = (value) => {
  if (typeof value === "number") return value;
  if (!value) return 0;

  const match = String(value).replace(/,/g, "").match(/\d+(\.\d+)?/);
  return match ? Number(match[0]) : 0;
};

const orderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      default: "",
      trim: true,
    },

    name: {
      type: String,
      default: "Product",
      trim: true,
    },

    category: {
      type: String,
      default: "",
      trim: true,
    },

    image: {
      type: String,
      default: "",
      trim: true,
    },

    price: {
      type: Number,
      default: 0,
      min: 0,
      set: parseNumber,
    },

    quantity: {
      type: Number,
      default: 1,
      min: 1,
      set: (value) => Math.max(1, Number(value || 1)),
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
      index: true,
    },

    customer: {
      name: { type: String, default: "", trim: true },
      email: { type: String, default: "", trim: true, lowercase: true },
      phone: { type: String, default: "", trim: true },
      address: { type: String, default: "", trim: true },
      city: { type: String, default: "", trim: true },
      state: { type: String, default: "", trim: true },
      pincode: { type: String, default: "", trim: true },
    },

    items: {
      type: [orderItemSchema],
      default: [],
      validate: {
        validator(items) {
          return Array.isArray(items) && items.length > 0;
        },
        message: "Order must contain at least one item",
      },
    },

    totalAmount: {
      type: Number,
      required: [true, "Total amount is required"],
      default: 0,
      min: 0,
      set: parseNumber,
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
      trim: true,
    },

    razorpayPaymentId: {
      type: String,
      default: "",
      trim: true,
    },

    razorpaySignature: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { timestamps: true }
);

orderSchema.pre("save", function (next) {
  if (!this.orderNumber) {
    const random = Math.floor(1000 + Math.random() * 9000);
    this.orderNumber = `MHC-${Date.now()}-${random}`;
  }

  this.items = (this.items || []).map((item) => ({
    productId: item.productId || "",
    name: item.name || "Product",
    category: item.category || "",
    image: item.image || "",
    price: parseNumber(item.price),
    quantity: Math.max(1, Number(item.quantity || 1)),
  }));

  if (!this.totalAmount || this.totalAmount <= 0) {
    this.totalAmount = this.items.reduce((sum, item) => {
      return sum + parseNumber(item.price) * Number(item.quantity || 1);
    }, 0);
  }

  next();
});

module.exports =
  mongoose.models.Order || mongoose.model("Order", orderSchema);