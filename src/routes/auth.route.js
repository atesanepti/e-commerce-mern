//External Dependencies
const express = require("express");
const router = express.Router();

//Internal Dependencies
const {
  handleLogin,
  handleLogout,
  refreshToken,
  checkProtected,
} = require("../controllers/auth.controller.js");

const { isLoggedIn, isLoggedOut } = require("../middlewares/auth.middlewares");

const {
  userLoginValidation,
  runValidation,
} = require("../middlewares/validation.middelwares");


//POST : api/auth/login
router.post(
  "/login",
  userLoginValidation,
  runValidation,
  isLoggedOut,
  handleLogin
);
//POST : api/auth/logout
router.post("/logout", isLoggedIn, handleLogout);
//GET : api/auth/refresh-token
router.get("/refresh-token", refreshToken);
//GET : api/auth/protected
router.get("/protected", checkProtected);

module.exports = router;
