const express = require("express");
const cors = require("cors");
const {
  createOrderHandler,
  paymentSuccessHandler,
  paymentLinkCallbackHandler,
} = require("./paymentHandlers");

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
        if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
          return callback(null, true);
        }

        return callback(new Error(`CORS blocked for origin: ${origin}`));
      },
      credentials: true,
    })
  );

  app.use(express.json());

  app.get("/", (req, res) => {
    res.send("Backend is running");
  });

  app.get("/api/health", (req, res) => {
    res.status(200).json({ success: true });
  });

  app.post("/api/create-order", createOrderHandler);
  app.post("/api/payment-success", paymentSuccessHandler);
  app.get("/api/payment-link-callback", paymentLinkCallbackHandler);

  return app;
}

module.exports = {
  createApp,
};
