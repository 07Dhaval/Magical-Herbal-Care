const express = require("express");
const nodemailer = require("nodemailer");
const Otp = require("../models/Otp");

const router = express.Router();

const generateOtp = () => {
  return Math.floor(
    100000 + Math.random() * 900000
  ).toString();
};

router.post("/send", async (req, res) => {
  try {
    const { email } = req.body;

    if (
      !email ||
      !/^\S+@\S+\.\S+$/.test(email)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Please enter valid email",
      });
    }

    if (
      !process.env.EMAIL_USER ||
      !process.env.EMAIL_PASS
    ) {
      return res.status(500).json({
        success: false,
        message:
          "Email credentials missing",
      });
    }

    const otp = generateOtp();

    await Otp.deleteMany({
      email: email.toLowerCase(),
    });

    await Otp.create({
      email: email.toLowerCase(),
      otp,
      expiresAt: new Date(
        Date.now() + 5 * 60 * 1000
      ),
    });

    const transporter =
      nodemailer.createTransport({
        service: "gmail",
        auth: {
          user:
            process.env.EMAIL_USER,
          pass:
            process.env.EMAIL_PASS,
        },
      });

    await transporter.sendMail({
      from: `"Magical Herbal Care" <${process.env.EMAIL_USER}>`,
      to: email,
      subject:
        "Your OTP Verification Code",
      html: `
        <div style="font-family: Arial; padding:20px;">
          <h2 style="color:#2f4f2f;">
            Magical Herbal Care
          </h2>
          <p>Your OTP is:</p>
          <h1 style="color:#b48a2c;">
            ${otp}
          </h1>
          <p>Valid for 5 minutes.</p>
        </div>
      `,
    });

    return res.status(200).json({
      success: true,
      message:
        "OTP sent successfully",
    });
  } catch (error) {
    console.error(
      "Send Email OTP Error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to send OTP",
    });
  }
});

router.post("/verify", async (req, res) => {
  try {
    const { email, otp } = req.body;

    const existingOtp =
      await Otp.findOne({
        email:
          email.toLowerCase(),
        otp,
        expiresAt: {
          $gt: new Date(),
        },
      });

    if (!existingOtp) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid or expired OTP",
      });
    }

    await Otp.deleteMany({
      email:
        email.toLowerCase(),
    });

    return res.status(200).json({
      success: true,
      message:
        "OTP verified successfully",
    });
  } catch (error) {
    console.error(
      "Verify OTP Error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message:
        "OTP verification failed",
    });
  }
});

module.exports = router;