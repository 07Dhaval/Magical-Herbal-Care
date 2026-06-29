const express = require("express");
const nodemailer = require("nodemailer");
const Otp = require("../models/Otp");

const router = express.Router();

const OTP_EXPIRY_MINUTES = 5;

// =====================================
// Generate 6 Digit OTP
// =====================================
const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// =====================================
// Email Validation
// =====================================
const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// =====================================
// Gmail Transporter
// =====================================
const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",

    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// =====================================
// SEND OTP
// =====================================
router.post("/send", async (req, res) => {
  try {

    const name = String(req.body.name || "").trim();

    const email = String(req.body.email || "")
      .trim()
      .toLowerCase();

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }

    if (!email || !isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address",
      });
    }

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return res.status(500).json({
        success: false,
        message: "Email credentials missing in backend env",
      });
    }

    const otp = generateOtp();

    const expiresAt = new Date(
      Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000
    );

    await Otp.deleteMany({ email });

    await Otp.create({
      name,
      email,
      otp,
      expiresAt,
    });

    const transporter = createTransporter();

    try {
      await transporter.verify();
      console.log("✅ SMTP Connected");
    } catch (err) {
      console.warn("SMTP Verify Failed:", err.message);
    }

    await transporter.sendMail({
      from: `"Magical Herbal Care" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your Magical Herbal Care OTP",

      html: `
      <div style="background:#f8f4ea;padding:30px;font-family:Arial,sans-serif;">

        <div style="max-width:600px;margin:auto;background:#fff;padding:35px;border-radius:12px;border:1px solid #e5d8b8;">

          <h2 style="text-align:center;color:#b48a2c;margin:0;">
            Magical Herbal Care
          </h2>

          <p style="margin-top:30px;">
            Hello <strong>${name}</strong>,
          </p>

          <p>
            Thank you for registering with Magical Herbal Care.
          </p>

          <p>
            Use the OTP below to verify your email.
          </p>

          <div style="
            margin:35px 0;
            text-align:center;
            font-size:40px;
            letter-spacing:8px;
            font-weight:bold;
            color:#2f4f2f;
          ">
            ${otp}
          </div>

          <p>
            This OTP is valid for
            <strong>${OTP_EXPIRY_MINUTES} minutes</strong>.
          </p>

          <p>
            Do not share this OTP with anyone.
          </p>

          <hr style="margin:30px 0">

          <p style="text-align:center;color:#b48a2c;font-weight:bold;">
            Magical Herbal Care
          </p>

        </div>

      </div>
      `,
    });

    return res.json({
      success: true,
      message: "OTP sent successfully",
      email,
    });

  } catch (error) {

    console.error("========== SEND OTP ERROR ==========");
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to send OTP",
      error: error.message,
    });
  }
});// =====================================
// VERIFY OTP
// =====================================
router.post("/verify", async (req, res) => {
  try {

    const email = String(req.body.email || "")
      .trim()
      .toLowerCase();

    const otp = String(req.body.otp || "")
      .trim();

    if (!email || !isValidEmail(email) || !otp) {
      return res.status(400).json({
        success: false,
        message: "Valid email and OTP are required",
      });
    }

    // Find OTP in database
    const record = await Otp.findOne({
      email,
      otp,
    });

    if (!record) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // Check OTP expiry
    if (record.expiresAt < new Date()) {

      await Otp.deleteMany({ email });

      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    // Delete OTP after successful verification
    await Otp.deleteMany({ email });

    return res.json({
      success: true,
      message: "OTP verified successfully",
      user: {
        name: record.name,
        email: record.email,
      },
    });

  } catch (error) {

    console.error("========== VERIFY OTP ERROR ==========");
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "OTP verification failed",
      error: error.message,
    });
  }
});// =====================================
// RESEND OTP (Optional)
// =====================================
router.post("/resend", async (req, res) => {
  try {

    const name = String(req.body.name || "").trim();

    const email = String(req.body.email || "")
      .trim()
      .toLowerCase();

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }

    if (!email || !isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email",
      });
    }

    const otp = generateOtp();

    const expiresAt = new Date(
      Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000
    );

    await Otp.deleteMany({ email });

    await Otp.create({
      name,
      email,
      otp,
      expiresAt,
    });

    const transporter = createTransporter();

    await transporter.sendMail({
      from: `"Magical Herbal Care" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your New OTP - Magical Herbal Care",

      html: `
      <div style="font-family:Arial;padding:30px;background:#f8f4ea;">
        <div style="max-width:600px;margin:auto;background:#fff;padding:30px;border-radius:12px;">

          <h2 style="text-align:center;color:#b48a2c;">
            Magical Herbal Care
          </h2>

          <p>Hello <strong>${name}</strong>,</p>

          <p>Your new OTP is</p>

          <h1 style="
            text-align:center;
            letter-spacing:8px;
            color:#2f4f2f;
          ">
            ${otp}
          </h1>

          <p>This OTP is valid for ${OTP_EXPIRY_MINUTES} minutes.</p>

        </div>
      </div>
      `,
    });

    return res.json({
      success: true,
      message: "OTP resent successfully",
    });

  } catch (error) {

    console.error("========== RESEND OTP ERROR ==========");
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to resend OTP",
      error: error.message,
    });
  }
});

// =====================================
// DEFAULT ROUTE
// =====================================
router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "OTP API Running Successfully",
  });
});

// =====================================
// EXPORT ROUTER
// =====================================
module.exports = router;