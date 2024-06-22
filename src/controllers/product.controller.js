//External Dependencies
const createHttpError = require("http-errors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//Internal Dependencies
const Product = require("../models/product.model");
const { successsResponse } = require("../helpers/response.handlers");
const { createJWT, verifyJWT } = require("../helpers/jwt");
const { slugfy } = require("../utilities/string");
const {productImgDir} = require("../../secret")


const {
  createProduct,
  findProducts,
  findProduct,
  deleteProduct,
  updateProduct,
} = require("../services/product.services.js");
const { imageSizeCheck } = require("../helpers/imgaeSizeChcek.js");
const {
  uploadFileOnCloudinary,
  deleteFileOnClouddinary,
} = require("../helpers/cloudinary.js");
const { deleteImage } = require("../helpers/deleteImage.js");
const { findWithId } = require("../services/queryWithId.js");

//POST : api/product/
const handleCreateProduct = async (req, res, next) => {
  let imageLink;
  try {
    const { name, description, quantity, sold, price, shiping, category } =
      req.body;

    const productBody = {};
    productBody.slug = name;
    for (let key in req.body) {
      const fileds = [
        "name",
        "description",
        "quantity",
        "sold",
        "price",
        "shiping",
        "category",
      ];
      if (fileds.includes(key)) {
        productBody[key] = req.body[key];
      } else {
        throw createHttpError(400, `${key} update not possiable`);
      }
    }

    if (req.file) {
      imageSizeCheck(req.file, "2mb");
      imageLink = await uploadFileOnCloudinary(req.file.path, {
        folder: productImgDir,
      });
      productBody.image = imageLink;
      await deleteImage(req.file.path);
    }
    const newProduct = await createProduct(productBody);

    return successsResponse(res, {
      statusCode: 201,
      message: "product was successfuly created",
      payload: newProduct,
    });
  } catch (error) {
    if (imageLink) {
      await deleteFileOnClouddinary(imageLink, productImgDir);
    }
    next(error);
  }
};

//GET : api/product
const handleGetProducts = async (req, res, next) => {
  try {
    const query = req.query;
    const productAndProductData = await findProducts(query);

    return successsResponse(res, {
      statusCode: 200,
      message: "products was returned successfuly",
      payload: {
        ...productAndProductData,
      },
    });
  } catch (error) {
    next(error);
  }
};

//GET : api/product/:slug
const handleGetProduct = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const product = await findProduct(slug);

    return successsResponse(res, {
      statusCode: 200,
      message: "product was returned successfuly",
      payload: product,
    });
  } catch (error) {
    next(error);
  }
};
//DELETE : api/product/:slug
const handleDeleteProduct = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const deletedProduct = await deleteProduct(slug);
    await deleteFileOnClouddinary(deletedProduct.image, productImgDir);
    
    return successsResponse(res, {
      statusCode: 200,
      message: "product was deleted successfuly",
    });
  } catch (error) {
    next(error);
  }
};

//PUT : api/product/:slug
const handleUpdateProduct = async (req, res, next) => {
  let imageLink;
  try {
    const { slug } = req.params;

    const payload = {};
    for (let key in req.body) {
      const updateFields = [
        "name",
        "description",
        "quantity",
        "sold",
        "price",
        "category",
        "shipping",
      ];
      if (updateFields.includes(key)) {
        payload[key] = req.body[key];
      } else {
        throw createHttpError(400, "unkown field cann't be updated");
      }
    }
    if (req.body.name) {
      payload.slug = req.body.name; //add the slug
    }

    const image = req.file;
    let oldImageLink;
    if (image) {
      imageSizeCheck(image, "2mb");
      imageLink = await uploadFileOnCloudinary(image.path,{folder : productImgDir})

      const product = await Product.findOne({slug});
      oldImageLink = product.image;

      await deleteImage(image.path)
      payload.image = imageLink;
    }

    const updatedProduct = await updateProduct(slug, payload);

    if(oldImageLink){
      await deleteFileOnClouddinary(oldImageLink, productImgDir)
    }

    return successsResponse(res, {
      statusCode: 201,
      message: "product was updated successfuly",
      payload: updatedProduct,
    });
  } catch (error) {
    if(imageLink){
      await deleteFileOnClouddinary(imageLink, productImgDir)
    }

    next(error);
  }
};

module.exports = {
  handleCreateProduct,
  handleGetProducts,
  handleGetProduct,
  handleDeleteProduct,
  handleUpdateProduct,
};
