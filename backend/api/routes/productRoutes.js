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
    const ext = path.extname(file.originalname).toLowerCase();

    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      ext;

    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Only JPG, PNG and WEBP images are allowed"),
      false
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB each image
    files: 5,
  },
});

const getImageUrl = (req, filename) => {
  return `${req.protocol}://${req.get(
    "host"
  )}/uploads/products/${filename}`;
};

const safeJsonParse = (value, fallback) => {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

const cleanImages = (images) => {
  if (!Array.isArray(images)) return [];
  return images.filter(Boolean).slice(0, 5);
};


// GET ALL PRODUCTS
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("Fetch products error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
    });
  }
});


// GET SINGLE PRODUCT
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(
      req.params.id
    );

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
    console.error("Fetch product error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch product",
    });
  }
});


// ADD PRODUCT
router.post("/", (req, res, next) => {
  upload.array("images", 5)(
    req,
    res,
    function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({
          success: false,
          message:
            "Each image must be under 5MB (max 5 images allowed)",
        });
      }

      if (err) {
        return res.status(400).json({
          success: false,
          message: err.message,
        });
      }

      next();
    }
  );
}, async (req, res) => {
  try {
    const {
      name,
      category,
      price,
      description,
    } = req.body;

    if (!name || !category || !price) {
      return res.status(400).json({
        success: false,
        message:
          "Name, category and price are required",
      });
    }

    const numericPrice = Number(price);

    if (Number.isNaN(numericPrice)) {
      return res.status(400).json({
        success: false,
        message:
          "Price must be a valid number",
      });
    }

    if (
      !req.files ||
      req.files.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "At least one product image is required",
      });
    }

    const imageUrls = req.files.map((file) =>
      getImageUrl(req, file.filename)
    );

    const parsedDescription =
      safeJsonParse(description, {});

    const product = await Product.create({
      name: name.trim(),
      category: category.trim(),
      price: numericPrice,
      image: imageUrls[0],
      images: imageUrls,
      description: parsedDescription,
    });

    res.status(201).json({
      success: true,
      message:
        "Product added successfully",
      product,
    });
  } catch (error) {
    console.error(
      "Add product error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to add product",
    });
  }
});


// UPDATE PRODUCT
router.put("/:id", upload.array("images", 5), async (req, res) => {
  try {
    const {
      name,
      category,
      price,
      description,
      oldImages,
    } = req.body;

    let imageUrls = cleanImages(
      safeJsonParse(oldImages, [])
    );

    if (
      req.files &&
      req.files.length > 0
    ) {
      const newImageUrls =
        req.files.map((file) =>
          getImageUrl(
            req,
            file.filename
          )
        );

      imageUrls = cleanImages([
        ...imageUrls,
        ...newImageUrls,
      ]);
    }

    const parsedDescription =
      safeJsonParse(description, {});

    const product =
      await Product.findByIdAndUpdate(
        req.params.id,
        {
          name,
          category,
          price: Number(price),
          image:
            imageUrls[0] || "",
          images: imageUrls,
          description:
            parsedDescription,
        },
        {
          new: true,
          runValidators: true,
        }
      );

    if (!product) {
      return res.status(404).json({
        success: false,
        message:
          "Product not found",
      });
    }

    res.json({
      success: true,
      message:
        "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error(
      "Update product error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to update product",
    });
  }
});


// DELETE PRODUCT
router.delete("/:id", async (req, res) => {
  try {
    const product =
      await Product.findByIdAndDelete(
        req.params.id
      );

    if (!product) {
      return res.status(404).json({
        success: false,
        message:
          "Product not found",
      });
    }

    res.json({
      success: true,
      message:
        "Product deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete product error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to delete product",
    });
  }
});

module.exports = router;