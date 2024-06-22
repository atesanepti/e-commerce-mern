//External Dependencies
const express = require("express");
const router = express.Router();

//Internal Dependencies
const { handleCreateCategory,handleGetCategories,handleGetCategory,handleUpdateCategory,handleDeleteCategory } = require("../controllers/category.controller");

const { isLoggedIn, isAdmin } = require("../middlewares/auth.middlewares");

const {
  categoryValidation,
  runValidation,
} = require("../middlewares/validation.middelwares");

//POST : api/category
router.post(
  "/",
  isLoggedIn,
  isAdmin,
  categoryValidation,
  runValidation,
  handleCreateCategory
);
//GET : api/category
router.get("/",handleGetCategories)
//GET : api/category/:slug
router.get("/:slug",handleGetCategory)
//PUT : api/category/:slug
router.put("/:slug",isLoggedIn,isAdmin,categoryValidation,runValidation,handleUpdateCategory)
//DELETE : api/category/:slug
router.delete("/:slug",isLoggedIn,isAdmin,handleDeleteCategory)

module.exports = router;
