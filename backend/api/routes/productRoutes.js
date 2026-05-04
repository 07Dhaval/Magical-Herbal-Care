const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Product = require("../models/product");

const router = express.Router();

const uploadDir = path.join(__dirname, "../uploads/products");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir);
  },
  filename(req, file, cb) {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);

    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

const getImageUrl = (req, filename) => {
  return `${req.protocol}://${req.get("host")}/uploads/products/${filename}`;
};

// GET all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ADD product
router.post(
  "/",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "images", maxCount: 5 },
  ]),
  async (req, res) => {
    try {
      const { name, category, price, description } = req.body;

      const singleImage = req.files?.image?.[0];
      const multiImages = req.files?.images || [];

      const image = singleImage ? getImageUrl(req, singleImage.filename) : "";

      const images = multiImages.map((file) =>
        getImageUrl(req, file.filename)
      );

      if (image && !images.includes(image)) {
        images.unshift(image);
      }

      const product = await Product.create({
        name,
        category,
        price: Number(price),
        description,
        image,
        images,
      });

      res.status(201).json({
        success: true,
        message: "Product added successfully",
        product,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

// UPDATE product
router.put(
  "/:id",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "images", maxCount: 5 },
  ]),
  async (req, res) => {
    try {
      const { name, category, price, description } = req.body;

      const oldProduct = await Product.findById(req.params.id);

      if (!oldProduct) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      const singleImage = req.files?.image?.[0];
      const multiImages = req.files?.images || [];

      let image = oldProduct.image;
      let images = oldProduct.images || [];

      if (singleImage) {
        image = getImageUrl(req, singleImage.filename);
      }

      if (multiImages.length > 0) {
        images = multiImages.map((file) => getImageUrl(req, file.filename));
      }

      if (image && !images.includes(image)) {
        images.unshift(image);
      }

      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        {
          name,
          category,
          price: Number(price),
          description,
          image,
          images,
        },
        { new: true }
      );

      res.json({
        success: true,
        message: "Product updated successfully",
        product: updatedProduct,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

// DELETE product
router.delete("/:id", async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;