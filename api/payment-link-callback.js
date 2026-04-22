import paymentHandlers from "../backend/api/paymentHandlers.js";

const { paymentLinkCallbackHandler } = paymentHandlers;

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      message: `Method ${req.method} not allowed`,
    });
  }

  return paymentLinkCallbackHandler(req, res);
}
