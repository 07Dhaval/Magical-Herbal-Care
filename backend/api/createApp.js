const express = require("express");
const cors = require("cors");
const path = require("path");

const {
  createOrderHandler,
  paymentSuccessHandler,
  paymentLinkCallbackHandler,
} = require("./paymentHandlers");

const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");

function getAllowedOrigins() {
  const envOrigins = (process.env.ALLOWED_ORIGINS || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  const defaultOrigins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:4173",
    "http://127.0.0.1:4173",
  ];

  return [...new Set([...defaultOrigins, ...envOrigins])];
}

function createApp() {
  const app = express();
  const allowedOrigins = getAllowedOrigins();

  app.use(
    cors({
      origin(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
          return callback(null, true);
        }
        return callback(new Error(`CORS blocked for origin: ${origin}`));
      },
      credentials: true,
    })
  );

  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true }));

  // ✅ show uploaded images publicly
  app.use(
    "/uploads",
    express.static(path.join(__dirname, "uploads"))
  );

  app.get("/", (req, res) => {
    res.send("Backend is running 🚀");
  });

  app.get("/api/health", (req, res) => {
    res.json({ success: true });
  });

  app.post("/api/create-order", createOrderHandler);
  app.post("/api/payment-success", paymentSuccessHandler);
  app.get("/api/payment-link-callback", paymentLinkCallbackHandler);

  app.use("/api/products", productRoutes);
  app.use("/api/orders", orderRoutes);

  return app;
}

module.exports = { createApp };