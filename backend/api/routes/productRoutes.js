const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Product = require("../models/Product");

console.log("✅ LOADED PRODUCT ROUTES:", __filename);

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
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter(req, file, cb) {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  },
});

const uploadProductImages = upload.fields([
  { name: "image", maxCount: 1 },
  { name: "images", maxCount: 5 },
]);

const getBaseUrl = (req) => {
  const protocol = req.headers["x-forwarded-proto"] || req.protocol;
  return `${protocol}://${req.get("host")}`;
};

const getImageUrl = (req, filename) => {
  return `${getBaseUrl(req)}/uploads/products/${filename}`;
};

const cleanImages = (images = []) => {
  return [...new Set(images.filter(Boolean))];
};

const parseDescription = (description) => {
  const fallback = {
    intro: "",
    ingredients: [],
    process: "",
    benefits: [],
    note: "",
    suitable: "",
  };

  if (!description) return fallback;

  try {
    return { ...fallback, ...JSON.parse(description) };
  } catch {
    return { ...fallback, intro: String(description) };
  }
};

const handleUploadError = (err, req, res, next) => {
  if (err) {
    return res.status(400).json({
      success: false,
      message: err.message || "Image upload failed",
    });
  }
  next();
};

// GET all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json({ success: true, products });
  } catch (error) {
    console.error("Get Products Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: error.message,
    });
  }
});

// GET single product
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({ success: true, product });
  } catch (error) {
    console.error("Get Product Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch product",
      error: error.message,
    });
  }
});

// ADD product
router.post("/", uploadProductImages, async (req, res) => {
  try {
    console.log("✅ ADD PRODUCT ROUTE HIT");
    console.log("BODY:", req.body);
    console.log("FILES:", req.files);

    const { name, category, price } = req.body;

    if (!name || !category || price === undefined || price === "") {
      return res.status(400).json({
        success: false,
        message: "Name, category and price are required",
      });
    }

    const priceNumber = Number(price);

    if (Number.isNaN(priceNumber) || priceNumber < 0) {
      return res.status(400).json({
        success: false,
        message: "Valid price is required",
      });
    }

    const singleImage = req.files?.image?.[0] || null;
    const multiImages = req.files?.images || [];

    let images = multiImages.map((file) => getImageUrl(req, file.filename));

    const mainImage = singleImage
      ? getImageUrl(req, singleImage.filename)
      : images[0] || "";

    images = cleanImages(mainImage ? [mainImage, ...images] : images);

    const product = await Product.create({
      name: String(name).trim(),
      category: String(category).trim(),
      price: priceNumber,
      description: parseDescription(req.body.description),
      image: mainImage || images[0] || "",
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
});

// UPDATE product
router.put("/:id", uploadProductImages, async (req, res) => {
  try {
    const oldProduct = await Product.findById(req.params.id);

    if (!oldProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const singleImage = req.files?.image?.[0] || null;
    const multiImages = req.files?.images || [];

    let image = oldProduct.image || "";
    let images = Array.isArray(oldProduct.images) ? [...oldProduct.images] : [];

    if (multiImages.length > 0) {
      images = multiImages.map((file) => getImageUrl(req, file.filename));
    }

    if (singleImage) {
      image = getImageUrl(req, singleImage.filename);
    }

    if (!image && images.length > 0) {
      image = images[0];
    }

    images = cleanImages(image ? [image, ...images] : images);

    const updateData = {
      image,
      images,
    };

    if (req.body.name !== undefined) {
      updateData.name = String(req.body.name).trim();
    }

    if (req.body.category !== undefined) {
      updateData.category = String(req.body.category).trim();
    }

    if (req.body.price !== undefined) {
      const priceNumber = Number(req.body.price);

      if (Number.isNaN(priceNumber) || priceNumber < 0) {
        return res.status(400).json({
          success: false,
          message: "Valid price is required",
        });
      }

      updateData.price = priceNumber;
    }

    if (req.body.description !== undefined) {
      updateData.description = parseDescription(req.body.description);
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
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
});

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
    console.error("Delete Product Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete product",
      error: error.message,
    });
  }
});

// Multer/image error handler
router.use(handleUploadError);

module.exports = router;