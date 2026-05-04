const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
    },

    otp: {
      type: String,
      required: [true, "OTP is required"],
      trim: true,
      minlength: 4,
      maxlength: 6,
    },

    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Auto delete expired OTP
otpSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 }
);

// Clean email before save
otpSchema.pre("save", function (next) {
  if (this.email) {
    this.email = this.email.toLowerCase().trim();
  }

  next();
});

module.exports =
  mongoose.models.Otp ||
  mongoose.model("Otp", otpSchema);