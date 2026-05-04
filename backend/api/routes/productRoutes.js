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
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  fileFilter(req, file, cb) {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only image files are allowed"));
  },
});

const getImageUrl = (req, filename) => {
  return `${req.protocol}://${req.get("host")}/uploads/products/${filename}`;
};

const parseDescription = (description) => {
  if (!description) {
    return {
      intro: "",
      ingredients: [],
      process: "",
      benefits: [],
      note: "",
      suitable: "",
    };
  }

  if (typeof description === "object") return description;

  try {
    return JSON.parse(description);
  } catch {
    return {
      intro: description,
      ingredients: [],
      process: "",
      benefits: [],
      note: "",
      suitable: "",
    };
  }
};

const isValidPrice = (price) => {
  return price !== undefined && price !== "" && !Number.isNaN(Number(price));
};

// GET all products from database
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("Get Products Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: error.message,
    });
  }
});

// GET single product from database
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Get Single Product Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch product",
      error: error.message,
    });
  }
});

// ADD product to database
router.post(
  "/",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "images", maxCount: 5 },
  ]),
  async (req, res) => {
    try {
      const { name, category, price } = req.body;

      if (!name || !category || !isValidPrice(price)) {
        return res.status(400).json({
          success: false,
          message: "Name, category and valid price are required",
        });
      }

      const singleImage = req.files?.image?.[0];
      const multiImages = req.files?.images || [];

      let images = multiImages.map((file) => getImageUrl(req, file.filename));

      const image = singleImage
        ? getImageUrl(req, singleImage.filename)
        : images[0] || "";

      if (image && !images.includes(image)) {
        images.unshift(image);
      }

      const product = await Product.create({
        name: name.trim(),
        category: category.trim(),
        price: Number(price),
        description: parseDescription(req.body.description),
        image,
        images,
      });

      res.status(201).json({
        success: true,
        message: "Product added successfully",
        product,
      });
    } catch (error) {
      console.error("Add Product Error:", error);

      res.status(500).json({
        success: false,
        message: "Failed to add product",
        error: error.message,
      });
    }
  }
);

// UPDATE product in database
router.put(
  "/:id",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "images", maxCount: 5 },
  ]),
  async (req, res) => {
    try {
      const oldProduct = await Product.findById(req.params.id);

      if (!oldProduct) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      const singleImage = req.files?.image?.[0];
      const multiImages = req.files?.images || [];

      let image = oldProduct.image || "";
      let images = Array.isArray(oldProduct.images)
        ? [...oldProduct.images]
        : [];

      if (multiImages.length > 0) {
        images = multiImages.map((file) => getImageUrl(req, file.filename));
      }

      if (singleImage) {
        image = getImageUrl(req, singleImage.filename);
      }

      if (!image && images.length > 0) {
        image = images[0];
      }

      if (image && !images.includes(image)) {
        images.unshift(image);
      }

      const updateData = {
        image,
        images,
      };

      if (req.body.name !== undefined) {
        updateData.name = req.body.name.trim();
      }

      if (req.body.category !== undefined) {
        updateData.category = req.body.category.trim();
      }

      if (req.body.price !== undefined) {
        if (!isValidPrice(req.body.price)) {
          return res.status(400).json({
            success: false,
            message: "Valid price is required",
          });
        }

        updateData.price = Number(req.body.price);
      }

      if (req.body.description !== undefined) {
        updateData.description = parseDescription(req.body.description);
      }

      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        updateData,
        {
          new: true,
          runValidators: true,
        }
      );

      res.json({
        success: true,
        message: "Product updated successfully",
        product: updatedProduct,
      });
    } catch (error) {
      console.error("Update Product Error:", error);

      res.status(500).json({
        success: false,
        message: "Failed to update product",
        error: error.message,
      });
    }
  }
);

// DELETE product from database
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
    console.error("Delete Product Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete product",
      error: error.message,
    });
  }
});

module.exports = router;