//External Dependencies
const mongoose = require("mongoose");

//Internal Dependencies
const { dbUrl } = require("../../secret");

const connectDB = async (option = {}) => {
  try {
    await mongoose.connect(dbUrl, option);
    console.log("DB Connection Established successful");
  } catch (error) {
    console.error(error.message);
  }
};

module.exports = { connectDB };
