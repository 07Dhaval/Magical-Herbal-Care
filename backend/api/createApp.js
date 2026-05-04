const express = require("express");
const cors = require("cors");
const path = require("path");

const orderRoutes = require("./routes/orderRoutes");
const productRoutes = require("./routes/productRoutes");
const otpRoutes = require("./routes/otpRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

function createApp() {
  const app = express();

  const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(",").map((origin) => origin.trim())
    : ["http://localhost:5173", "http://localhost:3000"];

  app.use(
    cors({
      origin: function (origin, callback) {
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
          return callback(null, true);
        }

        return callback(new Error("Not allowed by CORS"));
      },
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
      message: "API healthy",
    });
  });

  app.use("/api/orders", orderRoutes);
  app.use("/api/products", productRoutes);
  app.use("/api/otp", otpRoutes);
  app.use("/api", paymentRoutes);

  return app;
}

module.exports = { createApp };