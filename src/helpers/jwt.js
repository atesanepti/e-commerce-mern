//External Dependencies
const createHttpError = require("http-errors");
const jwt = require("jsonwebtoken");

const createJWT = (payload, secretKey, options = {}) => {
  if (typeof payload !== "object" || !payload) {
    throw new Error("payload required for create jwt");
  } else if (typeof secretKey !== "string" || secretKey == "") {
    throw new Error("secretkey required for create jwt");
  }
  try {
    const token = jwt.sign(payload, secretKey, options);
    console.log(payload);
    return token;
  } catch (error) {
    throw error;
  }
};

const verifyJWT = (token, sign,callback) => {

  try {
    if (!token) {
      const error = callback("TokenNotFound")
      throw createHttpError(404,error);
    }
    const decoded = jwt.verify(token, sign);

    if (!decoded) {
      const error = callback("VerifyFailed")
      throw createHttpError(400, error);
    }
    return decoded;
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      const error = callback("JsonWebTokenError")
      throw createHttpError(401, error);
    } else if (error.name == "TokenExpiredError") {
      const error = callback("TokenExpiredError")
      throw createHttpError(401, error);
    } else {
      throw error;

      
    }
  }
};

module.exports = { createJWT,verifyJWT };
