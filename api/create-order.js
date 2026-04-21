import paymentHandlers from "../backend/api/paymentHandlers.js";

const { createOrderHandler } = paymentHandlers;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: `Method ${req.method} not allowed`,
    });
  }

  return createOrderHandler(req, res);
}
