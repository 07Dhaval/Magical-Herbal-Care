const express = require("express");
const nodemailer = require("nodemailer");
const Otp = require("../models/Otp");

const router = express.Router();

const OTP_EXPIRY_MINUTES = 5;

// Generate 6 digit OTP
const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Email validation
const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// SMTP transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT || 587),

    // For Gmail on Render use false with port 587
    secure:
      String(process.env.SMTP_SECURE || "false").toLowerCase() === "true",

    requireTLS: true,

    // Force IPv4 (fixes Render ENETUNREACH issue)
    family: 4,

    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },

    connectionTimeout: 30000,
    greetingTimeout: 30000,
    socketTimeout: 30000,
  });
};

// SEND OTP
router.post("/send", async (req, res) => {
  try {
    const email = String(req.body.email || "")
      .trim()
      .toLowerCase();

    if (!email || !isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address",
      });
    }

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return res.status(500).json({
        success: false,
        message: "Email credentials missing in environment variables",
      });
    }

    const otp = generateOtp();
    const expiresAt = new Date(
      Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000
    );

    // Remove previous OTPs
    await Otp.deleteMany({ email });

    // Save new OTP
    await Otp.create({
      email,
      otp,
      expiresAt,
    });

    const transporter = createTransporter();

    // Verify SMTP connection
    await transporter.verify();

    // Send email
    await transporter.sendMail({
      from: `"Magical Herbal Care" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your Magical Herbal Care OTP Verification Code",
      html: `
        <div style="font-family: Arial, sans-serif; background:#f8f4ea; padding:20px;">
          <div style="max-width:500px; margin:auto; background:#ffffff; padding:25px; border-radius:12px; border:1px solid #e7dcc3;">
            
            <h2 style="color:#b48a2c; margin-top:0;">
              Magical Herbal Care
            </h2>

            <p style="color:#2f4f2f; font-size:16px;">
              Your OTP verification code is:
            </p>

            <div style="
              font-size:32px;
              font-weight:bold;
              letter-spacing:8px;
              color:#2f4f2f;
              margin:20px 0;
            ">
              ${otp}
            </div>

            <p style="color:#555;">
              This OTP is valid for ${OTP_EXPIRY_MINUTES} minutes.
            </p>

            <p style="color:#777; font-size:13px;">
              If you didn't request this OTP, please ignore this email.
            </p>
          </div>
        </div>
      `,
    });

    return res.json({
      success: true,
      message: "OTP sent successfully",
    });

  } catch (error) {
    console.error("Send Email OTP Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to send OTP",
      error: error.message,
    });
  }
});

// VERIFY OTP
router.post("/verify", async (req, res) => {
  try {
    const email = String(req.body.email || "")
      .trim()
      .toLowerCase();

    const otp = String(req.body.otp || "").trim();

    if (!email || !isValidEmail(email) || !otp) {
      return res.status(400).json({
        success: false,
        message: "Valid email and OTP are required",
      });
    }

    const record = await Otp.findOne({ email, otp });

    if (!record) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    if (record.expiresAt < new Date()) {
      await Otp.deleteMany({ email });

      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    // Delete used OTP
    await Otp.deleteMany({ email });

    return res.json({
      success: true,
      message: "OTP verified successfully",
    });

  } catch (error) {
    console.error("Verify OTP Error:", error);

    return res.status(500).json({
      success: false,
      message: "OTP verification failed",
      error: error.message,
    });
  }
});

module.exports = router;