//External Dependencies
const createHttpError = require("http-errors");
const bcrypt = require("bcryptjs");

//Internal Dependencies
const User = require("../models/users.models");
const { findWithId, deleteWithId, updateWithId } = require("./queryWithId");

async function findUser(id) {
  try {
    //make options
    const options = {
      password: 0,
    };

    const user = await findWithId(id, options, "user");

    return user;
  } catch (error) {
    throw error;
  }
}

async function findUsers(query) {
  const { search, limit, page } = {
    search: query.search || "",
    limit: Number(query.limit) || 5,
    page: Number(query.page) || 1,
  };

  const searchReqexp = new RegExp(".*" + search + ".*", "i");

  const filter = {
    isAdmin: { $ne: true },
    $or: [
      { name: { $regex: searchReqexp } },
      { phone: { $regex: searchReqexp } },
      { email: { $regex: searchReqexp } },
    ],
  };
  const options = {
    password: 0,
  };

  try {
    const users = await User.find(filter, options)
      .limit(limit)
      .skip((page - 1) * limit);
    if (users.length <= 0) {
      throw createHttpError(404, "users not found");
    }
    const usersCount = await User.find(filter).countDocuments();

    return {
      users,
      pagination: {
        page,
        limit,
        prevPage: page == 1 ? null : page - 1,
        nextPage: page == Math.ceil(usersCount / limit) ? null : page + 1,
        numberOfUsers: usersCount,
      },
    };
  } catch (error) {
    throw error;
  }
}

async function userDelete(id) {
  try {
   
    const deletedUser = await deleteWithId(id, "user");
    return deletedUser;
  } catch (error) {
    throw error;
  }
}

async function updateUser(id, payload) {
  try {
    const options = {
      new: true,
      context: "query",
      runValidators: true,
    };

    const updatedUser = await updateWithId(
      id,
      payload,
      options,
      "user"
    );
    return updatedUser;
  } catch (error) {
    throw error;
  }
}

async function manageUser(id, payload) {
  try {
  
    const options = {
      new: true,
      context: "query",
      runValidators: true,
    };

    const managedUser = await updateWithId(
      id,
      payload,
      options,
      "user"
    );

    return managedUser;
  } catch (error) {
    throw error;
  }
}

async function passwordChange(email, oldPassword, newPassword) {
  try {
    //check old password
    const user = await User.findOne({ email });

    if (!user) {
      throw createHttpError(404, "user not found with this email");
    }

    const password = await bcrypt.compare(oldPassword, user.password);

    if (!password) {
      throw createHttpError(401, "old password didn't match");
    }

    //set new password in database
    const filter = {
      email,
    };
    const payload = {
      password: newPassword,
    };
    const options = {
      new: true,
      context: "query",
      runValidators: true,
    };
    await User.updateOne(filter, payload, options).select("-password");
  } catch (error) {
    throw error;
  }
}

async function passwordReset(email, password) {
  try {
    //check old password
    const user = await User.findOne({ email });

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (isPasswordMatch) {
      throw createHttpError(
        409,
        "new password should be different from the current password"
      );
    }

    //set new password in database
    const filter = {
      email,
    };
    const payload = {
      password,
    };
    const options = {
      new: true,
      context: "query",
      runValidators: true,
    };
    const updatedUser = await User.findOneAndUpdate(
      filter,
      payload,
      options
    ).select("-password");

    return updatedUser;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  findUser,
  findUsers,
  userDelete,
  updateUser,
  manageUser,
  passwordChange,
  passwordReset,
};
