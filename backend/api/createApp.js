const express = require("express");
const cors = require("cors");
const path = require("path");

const orderRoutes = require("./routes/orderRoutes");
const productRoutes = require("./routes/productRoutes");
const otpRoutes = require("./routes/otpRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

function createApp() {
  const app = express();

  app.use(
    cors({
      origin: process.env.ALLOWED_ORIGINS
        ? process.env.ALLOWED_ORIGINS.split(",")
        : "*",
      credentials: true,
    })
  );

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use("/uploads", express.static(path.join(__dirname, "uploads")));

  app.get("/", (req, res) => {
    res.send("Magical Herbal Care API running...");
  });
app.use("/api/orders", orderRoutes);
  app.use("/api", paymentRoutes);
  app.use("/api/orders", orderRoutes);
  app.use("/api/products", productRoutes);
  app.use("/api/otp", otpRoutes);

  return app;
}

module.exports = { createApp };