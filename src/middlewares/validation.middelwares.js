//External Dependencies
const { check, validationResult } = require("express-validator");
const createHttpError = require("http-errors");
const bcrypt = require("bcryptjs");
const path = require("path");

//Internal Dependencies
const User = require("../models/users.models");
const { errorResponse } = require("../helpers/response.handlers");

const userValidation = [
  check("name")
    .trim()
    .notEmpty()
    .withMessage("name required")
    .isLength({ min: 3, max: 25 })
    .withMessage("name must be between 3 to 25 characters")
    .isAlpha("en-US", { ignore: " -" })
    .withMessage("name must only contain letters"),
  check("email")
    .trim()
    .notEmpty()
    .withMessage("email required")
    .isEmail()
    .withMessage("invalid email address")
    .custom(async (email) => {
      const userExist = await User.exists({ email });
      if (userExist) {
        throw new Error("user already exists");
      }
    }),

  check("phone")
    .trim()
    .notEmpty()
    .withMessage("phone required")
    .isMobilePhone("bn-BD", { strictMode: false })
    .withMessage("phone must be bangladeshi valid number"),

  check("password")
    .notEmpty()
    .withMessage("password required")
    .isLength({ min: 6 })
    .withMessage("password must be minimum 6 character")
    .isStrongPassword()
    .withMessage("password is so weak"),

  check("address").notEmpty().withMessage("address required"),
];

const userUpdateValidation = [
  check("name")
    .optional()
    .isLength({ min: 3, max: 25 })
    .withMessage("name must be between 3 to 25 characters")
    .isAlpha("en-US", { ignore: " -" })
    .withMessage("name must only contain letters")
    .trim(),

  check("email")
    .optional()
    .custom(async (email) => {
      if (email) {
        throw new Error("email can'nt be updated");
      }
      return true;
    }),

  check("phone")
    .optional()
    .trim()
    .isMobilePhone("bn-BD", { strictMode: false })
    .withMessage("phone must be bangladeshi valid number"),

  check("password")
    .optional()
    .custom(async (password) => {
      if (password) {
        throw new Error("password can'nt be updated");
      }
      return true;
    }),
];

const userLoginValidation = [
  check("email")
    .trim()
    .notEmpty()
    .withMessage("email required")
    .isEmail()
    .withMessage("invalid email address"),
  check("password")
    .notEmpty()
    .withMessage("password required")
    .isLength({ min: 6 })
    .withMessage("password must be minimum 6 character"),
];

const updatePassValidation = [
  check("email")
    .trim()
    .notEmpty()
    .withMessage("email required")
    .isEmail()
    .withMessage("invalid email address"),

  check("oldPassword").notEmpty().withMessage("old password required"),
  check("newPassword")
    .notEmpty()
    .withMessage("new password required")
    .isLength({ min: 6 })
    .withMessage("password must be minimum 6 character")
    .isStrongPassword()
    .withMessage("password is so weak"),
  check("confirmPassword")
    .notEmpty()
    .withMessage("confirm password required")
    .custom((confirmPass, { req }) => {
      const newPassword = req.body.newPassword;
      if (newPassword === confirmPass) {
        return true;
      } else {
        throw new Error("confirm password didn't match");
      }
    }),
];

const forgetPassValidation = [
  check("email")
    .trim()
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("invalid email address")
    .custom(async (email, { req }) => {
      const userExist = await User.exists({ email });
      if (!userExist) {
        throw new Error("user not found with this email");
      }
      return true;
    }),
];

const resetPassValidation = [
  check("password")
    .notEmpty()
    .withMessage("password required")
    .isLength({ min: 6 })
    .withMessage("password must be minimum 6 characters")
    .isStrongPassword()
    .withMessage("password is so weak"),
];

const categoryValidation = [
  check("name")
    .notEmpty()
    .withMessage("category name is required")
    .trim()
    .isLength({ min: 3 })
    .withMessage("category name should be minimum 3 characters"),
];

const productValidation = [
  check("name")
    .notEmpty()
    .withMessage("product name is required")
    .trim()
    .isLength({ min: 6 })
    .withMessage("product name should be minimum 6 characters")
    .isLength({ max: 100 })
    .withMessage("product name should be miximum 100 characters"),

  check("description")
    .notEmpty()
    .withMessage("description is required")
    .trim()
    .isLength({ min: 20 })
    .withMessage("description should be minimum 20 characters")
    .isLength({ max: 200 })
    .withMessage("description should be miximum 200 characters"),

  check("quantity")
    .notEmpty()
    .withMessage("quantity is required")
    .isInt({ min: 1 })
    .withMessage("product quantity must be greater than 0"),

  check("sold")
    .notEmpty()
    .withMessage("sold is required")
    .isInt({ min: 0 })
    .withMessage("product sold quantity must be a possitive number"),

  check("price")
    .notEmpty()
    .withMessage("product price is required")
    .isInt({ min: 1 })
    .withMessage("product price should be greater than 0"),

  check("image").custom((image, { req }) => {
    if (!req.file) {
      throw new Error("product image is reqiured");
    }
    return true;
  }),

  check("category")
    .notEmpty()
    .withMessage("product category is required")
    .custom((v) => {
      const regEx = /[0-9a-f]{24}/;
      const isMatched = regEx.test(v);
      if (!isMatched) {
        throw new Error("invalid category id");
      } else {
        return true;
      }
    }),
];

const productUpdateValidation = [
  check("name")
    .optional()
    .trim()
    .isLength({ min: 6 })
    .withMessage("product name should be minimum 6 characters")
    .isLength({ max: 100 })
    .withMessage("product name should be miximum 100 characters"),

  check("description")
    .optional()
    .trim()
    .isLength({ min: 20 })
    .withMessage("description should be minimum 20 characters")
    .isLength({ max: 200 })
    .withMessage("description should be miximum 200 characters"),

  check("quantity")
    .optional()
    .isInt({ min: 1 })
    .withMessage("product quantity must be greater than 0"),

  check("sold")
    .optional()
    .isInt({ min: 0 })
    .withMessage("product sold quantity must be a possitive number"),

  check("price")
    .optional()
    .isInt({ min: 1 })
    .withMessage("product price should be greater than 0"),

  check("category")
    .optional()
    .custom((v) => {
      const regEx = /[0-9a-f]{24}/;
      const isMatched = regEx.test(v);
      if (!isMatched) {
        throw new Error("invalid category id");
      } else {
        return true;
      }
    }),
];

const runValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    next(createHttpError(409, errors.array()[0].msg));
  } else {
    next();
  }
};

module.exports = {
  userValidation,
  userLoginValidation,
  updatePassValidation,
  forgetPassValidation,
  resetPassValidation,
  categoryValidation,
  productValidation,
  userUpdateValidation,
  productUpdateValidation,
  runValidation,
};
