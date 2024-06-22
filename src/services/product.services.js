//External Dependencies
const createHttpError = require("http-errors");

//Internal Dependencies
const Product = require("../models/product.model");

const createProduct = async (body) => {
  try {
    const newProduct = await Product.create(body);
    if (!newProduct) {
      throw createHttpError(400, "product was not created");
    }
    return newProduct;
  } catch (error) {
    throw error;
  }
};

const findProducts = async (query) => {
  try {
    const { page, limit, search } = {
      page: query.page ? Number(query.page) : 1,
      limit: query.limit ? Number(query.limit) : 5,
      search: query.search ? query.search : "",
    };

    const searchRegex = new RegExp(".*" + search + ".*");
    const filter = {
      slug : {$regex : searchRegex}
    }

    const products = await Product.find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean()
      .sort({ createdAt: -1 })
      .populate("category");

    

    if (products.length <= 0) {
      throw createHttpError(404, "products not found");
    }
    const productsCount = await Product.find(filter).countDocuments();

    return {
      products,
      pagination: {
        page,
        limit,
        prevPage: page == 1 ? null : page - 1,
        nextPage: page == Math.ceil(productsCount / limit) ? null : page + 1,
        numberOfProducts: productsCount,
      },
    };
  } catch (error) {
    throw error;
  }
};

const findProduct = async (slug) => {
  try {
    if (!slug) {
      throw createHttpError(400, "slug is required to find product");
    }

    const product = await Product.findOne({ slug });

    if (!product) {
      throw createHttpError(404, "product not found with this slug");
    }

    return product;

  } catch (error) {
    throw error;
  }
};

const deleteProduct = async (slug)=>{
  try {
    if(!slug){
      throw createHttpError(404, "slug is requred for delete product")
    }

    const deletedProduct = await Product.findOneAndDelete({slug})
    if(!deletedProduct){
      throw createHttpError(400, "product not found with this slug")
    }

    return deleteProduct
  } catch (error) {
    throw error;
  }
}

const updateProduct = async (slug,payload)=>{
  try {
    if(!slug){
      throw createHttpError(404, "slug is requred for update product")
    }
  
    const options = {
      new: true,
      context: "query",
      runValidators: true,
    };

    const updatedProduct = await Product.findOneAndUpdate({slug},payload,options)
    
    if(!updatedProduct){
      throw createHttpError(400, "product not found with this slug")
    }

    return updatedProduct
  } catch (error) {
    throw error;
  }
}


module.exports = {
  createProduct,
  findProducts,
  findProduct,
  deleteProduct,
  updateProduct
};
