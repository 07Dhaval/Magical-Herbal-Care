const express = require("express");
const nodemailer = require("nodemailer");
const dns = require("dns");
const Otp = require("../models/Otp");

dns.setDefaultResultOrder("ipv4first");

const router = express.Router();

const OTP_EXPIRY_MINUTES = 5;

const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// Force SMTP DNS lookup to IPv4 only
const lookupIPv4 = (hostname, options, callback) => {
  dns.lookup(hostname, { family: 4 }, callback);
};

const createTransporter = () => {
  const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
  const smtpPort = Number(process.env.SMTP_PORT || 587);

  console.log("SMTP CONFIG:", {
    host: smtpHost,
    port: smtpPort,
    secure: false,
    user: process.env.EMAIL_USER,
  });

  return nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: false,
    requireTLS: true,

    // important for Render
    family: 4,
    lookup: lookupIPv4,

    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },

    tls: {
      servername: smtpHost,
    },

    connectionTimeout: 30000,
    greetingTimeout: 30000,
    socketTimeout: 30000,
  });
};

router.post("/send", async (req, res) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();

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
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    await Otp.deleteMany({ email });

    await Otp.create({
      email,
      otp,
      expiresAt,
    });

    const transporter = createTransporter();

    await transporter.verify();

    await transporter.sendMail({
      from: `"Magical Herbal Care" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your Magical Herbal Care OTP",
      html: `
        <div style="font-family:Arial,sans-serif;background:#f8f4ea;padding:24px;">
          <div style="max-width:520px;margin:auto;background:#ffffff;border:1px solid #e7dcc3;border-radius:14px;padding:24px;">
            <h2 style="color:#b48a2c;margin-top:0;">Magical Herbal Care OTP</h2>
            <p style="color:#2f4f2f;">Your verification code is:</p>
            <div style="font-size:32px;font-weight:bold;letter-spacing:6px;color:#2f4f2f;margin:18px 0;">
              ${otp}
            </div>
            <p style="color:#555;">This OTP is valid for ${OTP_EXPIRY_MINUTES} minutes.</p>
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

router.post("/verify", async (req, res) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
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
    console.error("Verify OTP Error:", error);

    return res.status(500).json({
      success: false,
      message: "OTP verification failed",
      error: error.message,
    });
  }
});

module.exports = router;