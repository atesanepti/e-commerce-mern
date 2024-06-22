//External Dependencies
const mongoose = require("mongoose")


async function updateWithId(Model, filter, payload, options) {
  try {
    const item = await Model.findByIdAndUpdate(filter, payload, options);

    return { error: false, item };
  } catch (error) {
    if (error instanceof mongoose.Error) {
      return {
        error: error,
      };
    } else {
      console.log(error.message);
    }
  }
}

module.exports = updateWithId;
