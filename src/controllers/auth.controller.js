//External Dependencies
const createHttpError = require("http-errors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//Internal Dependencies
const User = require("../models/users.models");
const { jwtAccessKey, jwtRefreshtKey } = require("../../secret");
const { successsResponse } = require("../helpers/response.handlers");
const { createJWT, verifyJWT } = require("../helpers/jwt");
const {reduceTo} = require("../utilities/math")

//POST : api/auth/login
const handleLogin = async (req, res, next) => {
  try {
    //get email and password from req
    const { email, password } = req.body;

    //check email
    const user = await User.findOne({ email });

    if (!user) {
      throw createHttpError(404, "user doesn't exist with this email");
    }

    //check passoword
    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      throw createHttpError(401, "password didn't match!");
    }

    //is user banned?
    if (user.isBanned) {
      throw createHttpError(
        403,
        "your account is banned, please contact authrity"
      );
    }

    //create a access token
    const tokenPayload = {
      id : user._id,
      email : user.email,
      name : user.name,
      address : user.address,
      phone : user.phone
     
    };

    const accessToken = createJWT(tokenPayload, jwtAccessKey, {
      expiresIn: "1h",
    });
    const refreshToken = createJWT(tokenPayload, jwtRefreshtKey, {
      expiresIn: "7d",
    });

    //sent access token in cookie
    res.cookie("access_key", accessToken, {
      httpOnly: true,
      maxAge: reduceTo("1h") 
    });

    //sent access token in cookie
    res.cookie("refresh_key", refreshToken, {
      httpOnly: true,
      maxAge: reduceTo("7d")
    });

    //finaly send the success response
    return successsResponse(res, {
      statusCode: 200,
      message: "login successfull",
      payload: {},
    });
  } catch (error) {
    next(error);
  }
};

//POST : api/auth/logout
const handleLogout = async (req, res, next) => {
  try {
    //clear cookie
    res.clearCookie("access_key");
    res.clearCookie("refresh_key");

    //success response
    return successsResponse(res, {
      statusCode: 200,
      message: "logout successfull",
      payload: {},
    });
  } catch (error) {
    next(error);
  }
};

//GET : api/users/refresh-token
const refreshToken = (req, res, next) => {
  try {
    const refreshToken = req.cookies.refresh_key;

    //handle all jwt verify error (refresh token)
    const jwtVerifyErrorHandle = (error) => {
      if (error === "TokenNotFound") {
        return "refresh token not found! please login";
      } else if (error === "VerifyFailed") {
        return "failed to decode refresh token! please login";
      } else if (error === "JsonWebTokenError") {
        return "that was not a valid refresh token! please login";
      } else if (error === "TokenExpiredError") {
        return "refresh token has expired! please login";
      }
    };

    //decode refresh token
    let decodedRefreshToken = verifyJWT(
      refreshToken,
      jwtRefreshtKey,
      jwtVerifyErrorHandle
    );
    delete decodedRefreshToken.iat;
    delete decodedRefreshToken.exp;
    const tokenPayload = {
       ...decodedRefreshToken,
    };

    const accessToken = createJWT(tokenPayload, jwtAccessKey, {
      expiresIn: "1h",
    });

    //sent token as cookie
    res.cookie("access_key", accessToken, {
      httpOnly: true,
      maxAge: reduceTo("1h") //1h
    });

    return successsResponse(res, {
      statusCode: 200,
      message: "new access token has created successfuly",
    });
  } catch (error) {
    console.log(error);

    next(error);
  }
};

//GET : api/auth/protected
const checkProtected = (req, res, next) => {
  try {
    const accessToken = req.cookies.access_key;

    if (!accessToken) {
      throw createHttpError(400, "access token not found! please login");
    }

    const decodedToken = jwt.verify(accessToken, jwtAccessKey);
    if (!decodedToken) {
      throw createHttpError(400, "access token is invalid! please login");
    }

    return successsResponse(res, {
      statusCode: 200,
      message: "route is protected",
    });
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      next(createHttpError(401, "that was not a valid token! please login"));
    } else if (error.name == "TokenExpiredError") {
      next(createHttpError(401, "token has expired! please login"));
    } else {
      next(error);
    }
  }
};

module.exports = {
  handleLogin,
  handleLogout,
  refreshToken,
  checkProtected,
};
