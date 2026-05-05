const express = require("express");
const cors = require("cors");
const path = require("path");

const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const otpRoutes = require("./routes/otpRoutes");

const { createOrderHandler } = require("./paymentHandlers");

function createApp() {
  const app = express();

  const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(",").map((url) => url.trim())
    : [
        "http://localhost:5173",
        "http://localhost:3000",
        "https://magical-herbal-care.onrender.com",
        "https://magicalherbalcare.com",
        "https://www.magicalherbalcare.com",
      ];

  app.use(
    cors({
      origin(origin, callback) {
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
          return callback(null, true);
        }

        console.log("Blocked by CORS:", origin);
        return callback(new Error("Not allowed by CORS"));
      },
      credentials: true,
    })
  );

  app.use(express.json({ limit: "20mb" }));
  app.use(express.urlencoded({ extended: true, limit: "20mb" }));

  app.use("/uploads", express.static(path.join(__dirname, "uploads")));

  app.get("/", (req, res) => {
    res.send("Magical Herbal Care API running...");
  });

  app.get("/api/health", (req, res) => {
    res.json({
      success: true,
      message: "Backend is healthy",
      environment: process.env.NODE_ENV || "development",
    });
  });

  app.post("/api/create-order", createOrderHandler);

  app.use("/api/products", productRoutes);
  app.use("/api/orders", orderRoutes);
  app.use("/api/otp", otpRoutes);

  app.use((req, res) => {
    res.status(404).json({
      success: false,
      message: "API route not found",
    });
  });

  app.use((err, req, res, next) => {
    console.error("Global Server Error:", err.message);

    res.status(500).json({
      success: false,
      message: err.message || "Internal server error",
    });
  });

  return app;
}

module.exports = { createApp };