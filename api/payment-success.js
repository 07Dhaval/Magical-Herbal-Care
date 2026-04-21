import paymentHandlers from "../backend/api/paymentHandlers.js";

const { paymentSuccessHandler } = paymentHandlers;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: `Method ${req.method} not allowed`,
    });
  }

  return paymentSuccessHandler(req, res);
}
