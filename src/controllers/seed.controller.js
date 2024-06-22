//Internal Dependencies
const User = require("../models/users.models");
const Product = require("../models/product.model");
const data = require("../data");

// POST : api/seed/users
const seedUsers = async (req, res, next) => {
  try {
    await User.deleteMany(); //delete all users from db

    const users = await User.insertMany(data.users);
    res.status(201).json({
      success: true,
      message: "Users created",
      payload: users,
    });
  } catch (error) {
    next(error);
  }
};

//POST : api/seed/product
const seedProduct = async (req, res, next) => {
  try {
    await Product.deleteMany(); //delete all product from db



    const products = await Product.insertMany(data.product);
    res.status(201).json({
      success: true,
      message: "products created",
      payload: products,
    });
  } catch (error) {
    console.log(error);

    next(error);
  }
};

module.exports = { seedUsers, seedProduct };
