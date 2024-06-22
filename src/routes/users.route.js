//External Dependencies
const express = require("express");
const router = express.Router();



//Internal Dependencies
const {
  handleGetUsers,
  handleGetUser,
  handleDeleteUser,
  handleProccesRegister,
  handleUserVerify,
  handleUserUpdate,
  handleUserManage,
  handleUpdatePassword,
  handleForgetPassword,
  handleResetPassword,

} = require("../controllers/users.controller");

const { userAvatarUpload } = require("../middlewares/fileHandle.middlewares");

const {
  userValidation,
  updatePassValidation,
  forgetPassValidation,
  resetPassValidation,
  userUpdateValidation,
  runValidation,
} = require("../middlewares/validation.middelwares");
const {isLoggedIn,isLoggedOut,isAdmin} = require("../middlewares/auth.middlewares")
const {banStatus} = require("../middlewares/banStatus")




//POST : api/users/register
router.post(
  "/register",
  isLoggedOut,
  userAvatarUpload("avatar"),
  userValidation,
  runValidation,
  handleProccesRegister
);
//POST : api/users/verify/:token
router.post("/verify/:token", isLoggedOut,handleUserVerify);
//GET : api/users
router.get("/", isLoggedIn,isAdmin,handleGetUsers);
router.get("/:id([0-9a-f]{24})", isLoggedIn,handleGetUser);
//PUT : api/users/:id
router.put("/:id([0-9a-f]{24})",isLoggedIn,userAvatarUpload("avatar"),userUpdateValidation,runValidation,handleUserUpdate)
//DELETE : api/users/:id
router.delete("/:id([0-9a-f]{24})", isLoggedIn,handleDeleteUser);
//UPDATE : api/users/manage/:id
router.put("/manage/:id([0-9a-f]{24})",isLoggedIn,isAdmin,banStatus,handleUserManage)
//UPDATE : api/users/update-password
router.put("/update-password",isLoggedIn,updatePassValidation,runValidation,handleUpdatePassword)
//POST : api/users/forget-password
router.post("/forget-password",isLoggedOut,forgetPassValidation,runValidation,handleForgetPassword)
//PUT : api/users/reset-password
router.put("/reset-password/:token",isLoggedOut,resetPassValidation,runValidation,handleResetPassword)




module.exports = router;
