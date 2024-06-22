//External Dependencies
const createHttpError = require("http-errors");

//Internal Dependencies

const User = require("../models/users.models");
const { findWithId } = require("../services/queryWithId");


const banStatus = async (req, res, next) => {
  try {
    const action = req.body.action.toLowerCase();
    const { id } = req.params;

    if (!action) {
      throw createHttpError(404, "manage action required");
    }

    if (!id) {
      throw createHttpError(404, "user id not found");
    }

    //check status from database
    const user = await findWithId(id, { password: 0 }, "user");
    const userBanStatus = user.isBanned;

    // check user ban or unban
    if (userBanStatus && action === "ban") {
      throw createHttpError(400, "user already banned");
    } 
    else if(!userBanStatus && action === "unban" ){
        throw createHttpError(400, "user already unbanned");
    }
    else{
        next();
    }


  } catch (error) {
    next(error);
  }
};

module.exports = {
    banStatus
};
