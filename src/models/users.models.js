//External Dependencies
const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");
const createError = require("http-errors");
const createHttpError = require("http-errors");

//Internal Dependencies


const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      trim: true,
      minlength: [3, "name must be minimum 3 characters"],
      maxlength: [25, "name must be maximum 25 characters"],
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: [true, "the already email used"],
      trim: true,
      lowercase: true,
      validate: {
        validator: (value) => {
          const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*\.\w{2,4}$/;
          return emailRegex.test(value);
        },
        message: "please enter a valid email address",
      },
    },
    password: {
      type: String,
      required: [true, "password is required"],
      minlength: [6, "password must be minimum 6 character"],
      set: (value) => {
        return bcrypt.hashSync(value, bcrypt.genSaltSync(10));
      },
    },
    avatar: {
      type: String,

    },
    address: {
      type: String,
      required: [true, "user address is required"],
    },
    phone: {
      type: String,
      required: [true, "user phone is required"],
      trim: true,
      validate: {
        validator: (value) => {
          const bdPhoneRegex = /^(?:\+?88|0088)?01[15-9]\d{8}$/;
          return bdPhoneRegex.test(value);
        },
        message: "phone must be bangladeshi valid phone number",
      },
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isBanned: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);


const User = new model("user", userSchema);

module.exports = User
