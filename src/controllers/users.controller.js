//External Dependencies
const createError = require("http-errors");
const jwt = require("jsonwebtoken");

//Internal Dependencies
const User = require("../models/users.models");
const { successsResponse } = require("../helpers/response.handlers");
const { deleteImage } = require("../helpers/deleteImage");
const { createJWT, verifyJWT } = require("../helpers/jwt");
const {
  jwtActivationKey,
  clientUrl,
  jwtForgetKey,
  avatarImgDir,
} = require("../../secret");
const { sendEmail, verificationEmailTemplate, resetEmailTemplate } = require("../helpers/email");
const { imageSizeCheck } = require("../helpers/imgaeSizeChcek");
const cloudinary = require("../config/cloudinary");

const {
  uploadFileOnCloudinary,
  deleteFileOnClouddinary,
} = require("../helpers/cloudinary");

const {
  findUser,
  findUsers,
  userDelete,
  updateUser,
  manageUser,
  passwordChange,
  passwordReset,
} = require("../services/user.services");
const { reduceTo } = require("../utilities/math");
const { findWithId } = require("../services/queryWithId");
const { lastName } = require("../utilities/string");

//GET : api/users
const handleGetUsers = async (req, res, next) => {
  try {
    const query = req.query;
    const usersData = await findUsers(query);

    return successsResponse(res, {
      statusCode: 200,
      message: "users ware returned successfully",
      payload: usersData,
    });
  } catch (error) {
    next(error);
  }
};

//GET : api/users/:id
const handleGetUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await findUser(id);

    return successsResponse(res, {
      statusCode: 200,
      message: "user was returned successfully",
      payload: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

//DELETE : api/users/:id
const handleDeleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedUser = await userDelete(id);

    //delete user image
    const avatarPath = deletedUser.avatar;
    if (avatarPath) {
      await deleteFileOnClouddinary(avatarPath, avatarImgDir);
    }

    return successsResponse(res, {
      statusCode: 200,
      message: "user deleted",
      payload: deletedUser,
    });
  } catch (error) {
    next(error);
  }
};

//POST : api/users/register
const handleProccesRegister = async (req, res, next) => {
  try {
    const { name, email, phone, password, address } = req.body;

    const payload = {
      name,
      email,
      phone,
      address,
      password,
    };

    const avatar = req.file;
    if (avatar) {
      imageSizeCheck(avatar, "1mb");
      payload.avatar = avatar.path;
    }

    //create jwt token for user activation
    const token = createJWT(payload, jwtActivationKey, { expiresIn: "10m" });

    //prepared email
    const userLastName = lastName(name)
    const template = verificationEmailTemplate(
      userLastName,
      `${clientUrl}api/users/register/${token}`
    );
    const emailMeta = {
      preparedEmail: {
        email,
        subject: "Account Activation",
        html: template,
      },
      options: {
        successMsg: "successfuly verification email sent",
        errorMsg: "failed to send varification email",
      },
    };

    //send mail
    await sendEmail(emailMeta);

    return successsResponse(res, {
      statusCode: 201,
      message: "verification mail sended to your email",
      payload: {
        token,
      },
    });
  } catch (error) {
    //delete avatar from server
    if (req.file) {
      await deleteImage(req.file.path);
    }

    next(error);
  }
};

//POST : api/users/verify/:token
const handleUserVerify = async (req, res, next) => {
  let avatarLink;
  try {
    const { token } = req.params;
    //handle all jwt verify error (refresh token)
    const jwtVerifyErrorHandle = (error) => {
      if (error === "TokenNotFound") {
        return "activation token not found! please login agin";
      } else if (error === "VerifyFailed") {
        return "failed to decode activation token! please login agin";
      } else if (error === "JsonWebTokenError") {
        return "that was not a valid link! please login agin";
      } else if (error === "TokenExpiredError") {
        return "your verification link expired! please login agin";
      }
    };
    const decoded = verifyJWT(token, jwtActivationKey, jwtVerifyErrorHandle);

    const userExist = await User.exists({ email: decoded.email });
    if (userExist) {
      throw createError(409, "user already exists");
    }

    if (decoded.avatar) {
      avatarLink = await uploadFileOnCloudinary(decoded.avatar, {
        folder: avatarImgDir,
      });
      await deleteImage(decoded.avatar);
      decoded.avatar = avatarLink;
    }

    await User.create(decoded);

    await successsResponse(res, {
      statusCode: 201,
      message: "account activation successfully",
    });
  } catch (error) {
    if (avatarLink) {
      await deleteFileOnClouddinary(avatarLink, avatarImgDir);
    }
    next(error);
  }
};

//UPDATE : api/users/:id
const handleUserUpdate = async (req, res, next) => {
  let avatarLink;
  try {
    // const { name, email, phone, password, address } = req.body;
    const { id } = req.params;

    let payload = {};

    for (let key in req.body) {
      const fields = ["name", "phone", "password", "address"];
      if (key === "email") {
        throw createError(400, "you cann't update email");
      }
      if (fields.includes(key)) {
        payload[key] = req.body[key];
      }
    }

    const avatar = req.file;
    let oldImagePath;
    if (avatar) {
      imageSizeCheck(req.file, "1mb");
      avatarLink = await uploadFileOnCloudinary(avatar.path, {
        folder: avatarImgDir,
      });
      await deleteImage(avatar.path);

      const user = await findWithId(id, { password: 0 }, "user");
      oldImagePath = user.avatar ? user.avatar : "";
      payload.avatar = avatarLink;
    }
    const upadatedUser = await updateUser(id, payload);

    if (oldImagePath) {
      await deleteFileOnClouddinary(oldImagePath, avatarImgDir);
    }

    return successsResponse(res, {
      statusCode: 201,
      message: "user successfully updated",
      payload: upadatedUser,
    });
  } catch (error) {
    if (avatarLink) {
      await deleteFileOnClouddinary(avatarLink, avatarImgDir);
    }
    next(error);
  }
};

//UPDATE : api/users/manage/:id
const handleUserManage = async (req, res, next) => {
  try {
    const action = req.body.action.toLowerCase();

    const id = req.params.id;

    const payload = {};
    if (action === "ban") {
      payload.isBanned = true;
    } else if (action === "unban") {
      payload.isBanned = false;
    } else {
      throw createError(409, "action must be 'ban' or 'unban' ");
    }

    const managedUser = await manageUser(id, payload);

    const message =
      action === "ban" ? "user banned successful" : "user unbanned successful";
    return successsResponse(res, {
      statusCode: 200,
      message,
      payload: managedUser,
    });
  } catch (error) {
    next(error);
  }
};

//UPDATE : api/users/update-password
const handleUpdatePassword = async (req, res, next) => {
  try {
    const { email, oldPassword, newPassword } = req.body;

    await passwordChange(email, oldPassword, newPassword);

    return successsResponse(res, {
      statusCode: 201,
      message: "password changed successfuly",
      payload: {},
    });
  } catch (error) {
    next(error);
  }
};

//POST : api/users/forget-password
const handleForgetPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const payload = {
      email,
    };

    const options = {
      expiresIn: "10m",
    };

    const forgetPassToken = createJWT(payload, jwtForgetKey, options);

    // send email with token
    const userLastName = lastName(req.user.name);
    const emailMeta = {
      preparedEmail: {
        email,
        subject: "Please Reset Your Password",
        html: `${resetEmailTemplate(userLastName,`${clientUrl}/api/users/forget-password/${forgetPassToken}`)}`,
      },
      option: {
        successMsg: "successfuly reset email sent",
        errorMsg: "failed to send reset email",
      },
    };
    await sendEmail(emailMeta);

    return successsResponse(res, {
      statusCode: 201,
      message: "successfuly token sent to reset password",
      payload: {
        token: forgetPassToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

//put : api/users/reset-password
const handleResetPassword = async (req, res, next) => {
  try {
    const { password } = req.body;
    const { token } = req.params;

    //handle all jwt verify error (reset token)
    const jwtVerifyErrorHandle = (error) => {
      if (error === "TokenNotFound") {
        return "reset token not found!  please try agin";
      } else if (error === "VerifyFailed") {
        return "failed to decode reset token!  please try agin";
      } else if (error === "JsonWebTokenError") {
        return "that was not a valid link to reset password! please try agin";
      } else if (error === "TokenExpiredError") {
        return "your reset link expired! please try agin";
      }
    };

    //token decode and verify
    const decoded = verifyJWT(token, jwtForgetKey, jwtVerifyErrorHandle);

    const email = decoded.email;

    await passwordReset(email, password);

    return successsResponse(res, {
      statusCode: 201,
      message: "password reset successfuly",
      payload: {},
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  handleGetUsers,
  handleGetUser,
  handleDeleteUser,
  handleProccesRegister,
  handleUserVerify,
  handleUserUpdate,
  handleUserManage,
  handleUpdatePassword,
  handleForgetPassword,
  handleResetPassword,
};
