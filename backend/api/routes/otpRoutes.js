const express = require("express");
const nodemailer = require("nodemailer");
const Otp = require("../models/Otp");

const router = express.Router();

const OTP_EXPIRY_MINUTES = 5;

// Generate 6-digit OTP
const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Validate Email
const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// Gmail Transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// =======================
// SEND OTP
// =======================
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
        message: "Email credentials missing in backend env",
      });
    }

    const otp = generateOtp();

    const expiresAt = new Date(
      Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000
    );

    await Otp.deleteMany({ email });

    await Otp.create({
      email,
      otp,
      expiresAt,
    });

    const transporter = createTransporter();

    try {
      await transporter.verify();
      console.log("SMTP Connected Successfully");
    } catch (err) {
      console.warn("SMTP Verify Failed:", err.message);
    }

    await transporter.sendMail({
      from: `"Magical Herbal Care" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your Magical Herbal Care OTP",
      html: `      <div style="font-family:Arial,sans-serif;background:#f8f4ea;padding:24px;">
        <div style="max-width:520px;margin:auto;background:#ffffff;border:1px solid #e7dcc3;border-radius:14px;padding:24px;">

          <h2 style="color:#b48a2c;margin-top:0;">
            Magical Herbal Care OTP
          </h2>

          <p style="color:#2f4f2f;">
            Your verification code is:
          </p>

          <div
            style="
              font-size:34px;
              font-weight:bold;
              letter-spacing:8px;
              color:#2f4f2f;
              margin:20px 0;
              text-align:center;
            "
          >
            ${otp}
          </div>

          <p style="color:#555;">
            This OTP is valid for
            <b>${OTP_EXPIRY_MINUTES} minutes</b>.
          </p>

          <p style="color:#777;font-size:13px;">
            Please do not share this OTP with anyone.
          </p>

          <hr style="margin:20px 0;border:none;border-top:1px solid #eee;" />

          <p
            style="
              text-align:center;
              color:#b48a2c;
              font-weight:bold;
            "
          >
            Magical Herbal Care
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
    console.error("========== OTP ERROR ==========");
    console.error("Message:", error.message);
    console.error("Code:", error.code);
    console.error("Response:", error.response);
    console.error("Response Code:", error.responseCode);
    console.error(error);
    console.error("===============================");

    return res.status(500).json({
      success: false,
      message: "Failed to send OTP",
      error: error.message,
    });
  }
});

// =======================
// VERIFY OTP
// =======================
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

    await Otp.deleteMany({ email });

    return res.json({
      success: true,
      message: "OTP verified successfully",
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
});

module.exports = router;