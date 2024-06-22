//External Dependencies
const express = require("express");
const router = express.Router();

//Internal Dependencies
const {
  handleCreateProduct,
  handleGetProducts,
  handleGetProduct,
  handleDeleteProduct,
  handleUpdateProduct,
} = require("../controllers/product.controller");

const { isLoggedIn, isAdmin } = require("../middlewares/auth.middlewares");
const { productImageUpload } = require("../middlewares/fileHandle.middlewares");

const {
  productValidation,
  productUpdateValidation,
  runValidation,
} = require("../middlewares/validation.middelwares");

// POST : api/product
router.post(
  "/",
  isLoggedIn,
  isAdmin,
  productImageUpload("image"),
  productValidation,
  runValidation,
  handleCreateProduct
);

// GET : api/product
router.get("/", handleGetProducts);

// GET : api/product/:slug
router.get("/:slug", handleGetProduct);

// DELETE : api/product/:slug
router.delete("/:slug", handleDeleteProduct);

// PUT : api/product/:slug
router.put(
  "/:slug",
  isLoggedIn,
  isAdmin,
  productImageUpload("image"),
  productUpdateValidation,
  runValidation,
  handleUpdateProduct
);

module.exports = router;
