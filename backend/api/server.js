const path = require("path");
const dotenv = require("dotenv");

// LOAD ENV FIRST (VERY IMPORTANT)
dotenv.config({ path: path.join(__dirname, ".env") });

const { createApp } = require("./createApp");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // DEBUG (optional - remove later)
    console.log("Razorpay Key:", process.env.RAZORPAY_KEY_ID ? "Loaded" : "Missing");

    await connectDB();

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      console.warn(
        "⚠️ Razorpay keys missing. Payment API will not work."
      );
    }

    const app = createApp();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Server start error:", error.message);
    process.exit(1);
  }
};

startServer();