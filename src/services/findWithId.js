//External Dependencies


async function findWithId(Model, filter, options) {
  try {
    const item = await Model.findOne(filter, options);
    return { error: false, item };
  } catch (error) {
    return {
      error,
    };
  }
}

module.exports = findWithId;
