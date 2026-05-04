const express = require("express");
const cors = require("cors");
const path = require("path");

const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const otpRoutes = require("./routes/otpRoutes");

function createApp() {
  const app = express();

  const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(",").map((url) => url.trim())
    : "*";

  app.use(
    cors({
      origin: allowedOrigins,
      credentials: true,
    })
  );

  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));

  app.use("/uploads", express.static(path.join(__dirname, "uploads")));

  app.get("/", (req, res) => {
    res.send("Magical Herbal Care API running...");
  });

  app.get("/api/health", (req, res) => {
    res.json({
      success: true,
      message: "Backend is healthy",
    });
  });

  app.use("/api/products", productRoutes);
  app.use("/api/orders", orderRoutes);
  app.use("/api/otp", otpRoutes);

  app.use((req, res) => {
    res.status(404).json({
      success: false,
      message: "API route not found",
    });
  });

  return app;
}

module.exports = { createApp };