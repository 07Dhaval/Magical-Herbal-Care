const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      default: 0,
    },

    description: {
      intro: {
        type: String,
        default: "",
      },

      ingredients: {
        type: [String],
        default: [],
      },

      process: {
        type: String,
        default: "",
      },

      benefits: {
        type: [String],
        default: [],
      },

      note: {
        type: String,
        default: "",
      },

      suitable: {
        type: String,
        default: "",
      },
    },

    image: {
      type: String,
      default: "",
    },

    images: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Auto set main image from images array
productSchema.pre("save", function (next) {
  try {
    if (!this.image && this.images && this.images.length > 0) {
      this.image = this.images[0];
    }

    next();
  } catch (error) {
    next(error);
  }
});

module.exports =
  mongoose.models.Product ||
  mongoose.model("Product", productSchema);