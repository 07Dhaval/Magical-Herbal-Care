const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    customer: Object,
    items: Array,
    total: Number,
    paymentId: String,
    orderId: String,
    status: {
      type: String,
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);