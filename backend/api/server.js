const path = require("path");
const dotenv = require("dotenv");
const { createApp } = require("./createApp");
const connectDB = require("./config/db"); // 👈 ADD THIS

dotenv.config({ path: path.join(__dirname, ".env") });

// 👇 CONNECT DATABASE
connectDB();

if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  console.error("Missing Razorpay credentials in backend/api/.env");
  process.exit(1);
}

const app = createApp();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});