const mongoose = require("mongoose");

const descriptionSchema = new mongoose.Schema(
  {
    intro: {
      type: String,
      default: "",
      trim: true,
    },

    ingredients: {
      type: [String],
      default: [],
    },

    process: {
      type: String,
      default: "",
      trim: true,
    },

    benefits: {
      type: [String],
      default: [],
    },

    note: {
      type: String,
      default: "",
      trim: true,
    },

    suitable: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { _id: false }
);

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
    },

    price: {
      type: Number,
      required: [true, "Price is required"],
      default: 0,
      min: 0,
      set: (value) => {
        if (typeof value === "number") return value;
        if (!value) return 0;

        const cleaned = String(value)
          .replace(/,/g, "")
          .match(/\d+(\.\d+)?/);

        return cleaned ? Number(cleaned[0]) : 0;
      },
    },

    description: {
      type: descriptionSchema,
      default: () => ({}),
    },

    image: {
      type: String,
      default: "",
      trim: true,
    },

    images: {
      type: [String],
      default: [],
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// IMPORTANT: no "next" here
productSchema.pre("validate", function () {
  this.images = Array.isArray(this.images)
    ? this.images.filter(Boolean)
    : [];

  if (!this.image && this.images.length > 0) {
    this.image = this.images[0];
  }

  if (this.image && !this.images.includes(this.image)) {
    this.images.unshift(this.image);
  }
});

productSchema.methods.toJSON = function () {
  const product = this.toObject();

  product.images = Array.isArray(product.images)
    ? product.images.filter(Boolean)
    : [];

  if (!product.image && product.images.length > 0) {
    product.image = product.images[0];
  }

  return product;
};

module.exports =
  mongoose.models.Product || mongoose.model("Product", productSchema);