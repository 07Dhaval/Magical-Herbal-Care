const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },

    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
      default: "",
    },

    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
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
      validate: {
        validator: function (value) {
          return value.length <= 5;
        },
        message: "Maximum 5 images allowed",
      },
    },
  },
  {
    timestamps: true,
  }
);

// Auto set main image from images array
productSchema.pre("save", function (next) {
  if (!this.image && this.images.length > 0) {
    this.image = this.images[0];
  }

  next();
});

module.exports = mongoose.model("Product", productSchema);