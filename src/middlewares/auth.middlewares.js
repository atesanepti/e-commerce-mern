//External Dependencies
const jwt = require("jsonwebtoken");
const createHttpError = require("http-errors");

//Internal Dependencies
const { jwtAccessKey } = require("../../secret");
const { verifyJWT } = require("../helpers/jwt");
const { findWithId } = require("../services/queryWithId");

const isLoggedIn = (req, res, next) => {
  try {
    //get token from req
    const accessToken = req.cookies.access_key;

    //handle jwt verify errors 
    const handleJwtErrors = (error)=>{
      if(error === "TokenNotFound"){
        return "access token not found!"
      }
      else if(error === "VerifyFailed"){
        return "failed to authentication access token! please login or and try agin"
      }
      else if(error === "JsonWebTokenError"){
        return "invalid token authentication failed! please login or and try agin"
      }
      else if(error === "TokenExpiredError"){
        return "access token has expired! please login and try agin"
      }
    }

    //check token with jwt
    const user = verifyJWT(accessToken,jwtAccessKey,handleJwtErrors)

    //set user data with req user
    req.user = user;
    
    //go to the next middelwares
    next()
    
  } catch (error) {
      next(error);
  }
};

const isLoggedOut = (req, res, next) => {
  try {
    const accessToken = req.cookies.access_key;
    
    if(accessToken){
      const user = jwt.verify(accessToken, jwtAccessKey);
      if(user){
        throw createHttpError(400, "user already logged in");
      }
      res.clearCookie("access-key");
      return next()
    }
    return next()

  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      res.clearCookie("access-key");
      next();
    } else {
      next(error);
    }
  }
};

const isAdmin = async(req, res, next) => {
  try {
    //get user from req user
    const userId = req.user.id;
    console.log(req.user)
    const user = await findWithId(userId,{password : 0}, "user");

    if (user.isAdmin) {
      next();
    } else {
      throw createHttpError(403, "must be an admin to access the route");
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  isLoggedIn,
  isLoggedOut,
  isAdmin,
};
