//External Dependencies
const express = require("express");
const router = express.Router();

//Internal Dependencies
const {seedUsers,seedProduct} = require("../controllers/seed.controller")

// POST : api/seed/users
router.post("/users",seedUsers);
// POST : api/seed/product
router.post("/product",seedProduct);

module.exports = router;