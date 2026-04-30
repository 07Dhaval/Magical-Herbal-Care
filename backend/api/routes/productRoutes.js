const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Product = require("../models/Product");

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

router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json({ success: true, products });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch products" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    res.json({ success: true, product });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch product" });
  }
});

router.post("/", upload.array("images", 5), async (req, res) => {
  try {
    const { name, category, price, description } = req.body;

    if (!name || !category || !price) {
      return res.status(400).json({
        success: false,
        message: "Name, category and price are required",
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one product image is required",
      });
    }

    const imageUrls = req.files.map((file) => getImageUrl(req, file.filename));

    const product = await Product.create({
      name,
      category,
      price: Number(price),
      image: imageUrls[0],
      images: imageUrls,
      description: JSON.parse(description || "{}"),
    });

    res.status(201).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put("/:id", upload.array("images", 5), async (req, res) => {
  try {
    const { name, category, price, description, oldImages } = req.body;

    let imageUrls = oldImages ? JSON.parse(oldImages) : [];

    if (req.files && req.files.length > 0) {
      imageUrls = req.files.map((file) => getImageUrl(req, file.filename));
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        category,
        price: Number(price),
        image: imageUrls[0],
        images: imageUrls,
        description: JSON.parse(description || "{}"),
      },
      { new: true },
    );

    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Product deleted" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to delete product" });
  }
});

module.exports = router;
