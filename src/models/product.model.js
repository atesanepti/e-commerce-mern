//External Dependencies
const { Schema, model, mongo } = require("mongoose");

//Internal Dependencies
const {slugfy} = require("../utilities/string")


const productSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "product name is required"],
      trim: true,
      minlength: [3, "product name must be minimum 3 characters"],
    },
    slug : {
      type : String,
      required: [true, "product slug is required"],
      trim : true,
      unique : true,
      set : (value)=> slugfy(value)
    },
    description: {
      type: String,
      required: [true, "product description is required"],
      trim: true,
      minlength: [8, "product description must be minimum 8 characters"],
    },
    quantity: {
      type: Number,
      required: [true, "product quantify is required"],
      validate: {
        validator: (value) => value > 0,
        message: "product quantity must be greater than 0 ",
      },
    },
    sold: {
      type: Number,
      required: [true, "product price is required"],
      validate: {
        validator: (value) => value > 0,
        message: "product sold quantity must be possitive",
      },
    },
    price: {
      type: Number,
      required: [true, "product price is required"],
      validate: {
        validator: (value) => value > 0,
        message: "product price must be greater then 0",
      },
    },
    shipping: {
      type: Number,
      default: 0,

    },
    image: {
      type: String,
      required : [true, "product image is required"]
    },
    category : {
      type : Schema.Types.ObjectId,
      ref : "category",
      required : true
    }
  },
  { timestamps: true }
);

const Product = new model("product", productSchema);

module.exports = Product;
