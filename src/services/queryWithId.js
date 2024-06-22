//Internal Dependencies
const User = require("../models/users.models");
const Product = require("../models/product.model");
const Category = require("../models/category.model");
const createHttpError = require("http-errors");

const modelChooser = (modleName)=>{
  if(modleName === "user" || modleName == "users"){
    return User;
  }
  else if(modleName === "product" || modleName == "products"){
    return Product;
  }
  else if(modleName === "category" || modleName == "categorys"){
    return Category;
  }
  else {
    console.log("dev error : modelName missing in database query operation")
    throw new Error("server side error")
  }
}

const findWithId = async (id, options = {}, modelName) => {
  try {
    const Model = modelChooser(modelName);
    if (!id) {
      throw createHttpError(
        400,
        `${modelName} id not foundd to find ${modelName}`
      );
    }
    const data = await Model.findById(id, options);
    if (!data) {
      throw createHttpError(
        404,
        `${modelName} not found with this id to find ${modelName}`
      );
    }
    return data;
  } catch (error) {
    if (error.name === "CastError") {
      throw createHttpError(
        400,
        `${modelName} id is not a valid id to ${modelName}`
      );
    }
    throw error;
  }
};

const deleteWithId = async (id, modelName) => {
  try {
    const Model = modelChooser(modelName)
    if (!id) {
      throw createHttpError(
        400,
        `${modelName} id not found to delete ${modelName}`
      );
    }
    const data = await Model.findByIdAndDelete(id).lean();
    if (!data) {
      throw createHttpError(
        404,
        `${modelName} not found with this id to delete ${modelName}`
      );
    }
    return data;

  } catch (error) {
    if (error.name === "CastError") {
      throw createHttpError(
        400,
        `${modelName} id is not a valid id to delete ${modelName}`
      );
    }
    throw error;
  }
};

const updateWithId = async (id, payload, options = {}, modelName) => {
  try {
    console.log(id)
    const Model = modelChooser(modelName)
    if (!id) {
      throw createHttpError(
        400,
        `${modelName} id not found to update ${modelName}`
      );
    }
    const data = await Model.findByIdAndUpdate(id, payload, options);
    if (!data) {
      throw createHttpError(
        404,
        `${modelName} not found with this id to update ${modelName}`
      );
    }

    return data;
  } catch (error) {
    if (error.name === "CastError") {
      throw createHttpError(
        400,
        `${modelName} id is not a valid id to update ${modelName}`
      );
    }
    throw error;
  }
};

module.exports = {
  findWithId,
  deleteWithId,
  updateWithId,
};
