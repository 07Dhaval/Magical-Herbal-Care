const express = require("express");
const nodemailer = require("nodemailer");
const Otp = require("../models/Otp");

const router = express.Router();

const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

router.post("/send", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address",
      });
    }

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return res.status(500).json({
        success: false,
        message: "Email credentials missing in .env file",
      });
    }

    const otp = generateOtp();

    await Otp.deleteMany({ email });

    await Otp.create({
      email,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.verify();

    await transporter.sendMail({
      from: `"Magical Herbal Care" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your OTP Verification Code",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background:#fffdf7;">
          <div style="max-width:500px; margin:auto; border:1px solid #e7dcc3; border-radius:12px; padding:24px;">
            <h2 style="color:#2f4f2f; margin:0 0 12px;">Magical Herbal Care</h2>
            <p style="color:#456b3d;">Your OTP verification code is:</p>
            <h1 style="color:#b48a2c; letter-spacing:4px; font-size:34px;">${otp}</h1>
            <p style="color:#456b3d;">This OTP is valid for 5 minutes.</p>
          </div>
        </div>
      `,
    });

    return res.status(200).json({
      success: true,
      message: "OTP sent to email successfully",
    });
  } catch (error) {
    console.error("Send Email OTP Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to send email OTP",
      error: error.message,
    });
  }
});

router.post("/verify", async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    const otpRecord = await Otp.findOne({
      email,
      otp: otp.toString(),
      expiresAt: { $gt: new Date() },
    });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    await Otp.deleteMany({ email });

    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    console.error("Verify Email OTP Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "OTP verification failed",
      error: error.message,
    });
  }
});

module.exports = router;