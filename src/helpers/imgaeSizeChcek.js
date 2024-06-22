
//internal dependencies;
const createHttpError = require("http-errors");
const {reduceTo} = require("../utilities/math")

const imageSizeCheck = (file, size) => {
  try {   
    if (file.size > reduceTo(size)) {
      throw createHttpError(`image size must be within ${size}`);
    }
  } catch (error) {
    throw error;
  }
};

module.exports = {
  imageSizeCheck,
};
