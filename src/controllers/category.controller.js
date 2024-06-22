//External Dependencies
const createHttpError = require("http-errors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//Internal Dependencies
const Category = require("../models/category.model");
const { successsResponse } = require("../helpers/response.handlers");
const { createJWT, verifyJWT } = require("../helpers/jwt");
const {slugfy} = require("../utilities/string");
const { createCategory ,getCategory,updateCategory,deleteCategory} = require("../services/category.services");


//POST : api/category/
const handleCreateCategory = async(req,res,next)=>{
    try {
        const {name} = req.body;
        
        const newCategory = await createCategory(name);

        return successsResponse(res, {
            statusCode : 201,
            message : "category successfuly created",
            payload : newCategory
        })
        
    } catch (error) {
        next(error)
    }
}

//GET : api/api/category/
const handleGetCategories = async(req,res,next)=>{
    try {
        const categories = await Category.find({}).select("name slug").lean();

        if(categories.length <= 0){
            throw createHttpError(404, "category not found")
        }
       
        return successsResponse(res, {
            statusCode : 200,
            message : "categories has got successfuly",
            payload : categories
        })
        
    } catch (error) {
        next(error);
    }
}


//GET : api/category/:slug
const handleGetCategory = async(req,res,next)=>{
    try {
        const {slug} = req.params;
        const category = await getCategory(slug);

        return successsResponse(res, {
            statusCode : 200,
            message : "category has got successfuly",
            payload : category
        })
        
    } catch (error) {
        next(error)
    }
}

//PUT : api/category/:slug
const handleUpdateCategory = async(req,res,next)=>{
    try {
        const {slug} = req.params;
        const {name} = req.body;
        const updatedCategory = await updateCategory(slug,name);

        return successsResponse(res, {
            statusCode : 201,
            message : "category successfuly updated",
            payload : updatedCategory
        })
        
    } catch (error) {
        next(error)
    }
}
//DELETE : api/category/:slug
const handleDeleteCategory = async(req,res,next)=>{
    try {
        const {slug} = req.params;
        const deletedCategory = await deleteCategory(slug);

        return successsResponse(res, {
            statusCode : 200,
            message : "category successfuly deleted",
            payload : deletedCategory
        })
        
    } catch (error) {
        next(error)
    }
}


module.exports = {
    handleCreateCategory,
    handleGetCategories,
    handleGetCategory,
    handleUpdateCategory,
    handleDeleteCategory
    
};
