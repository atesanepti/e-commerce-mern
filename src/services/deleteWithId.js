//External Dependencies
const createError = require("http-errors");
const mongoose = require("mongoose");

async function deleteWithId(Model, filter, options) {
  try {
    // let item = await Model.findByIdAndDelete(filter, options);

    const item = await Model.findOne(filter,options);
    await Model.deleteOne(filter);
    
    return { error: false, item };
  } catch (error) {
    return {
      error,
    };
  }
}

module.exports = deleteWithId;
