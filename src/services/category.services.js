//External Dependencies
const createHttpError = require("http-errors");


//Internal Dependencies

const Category = require("../models/category.model")
const {slugfy} = require("../utilities/string")

const createCategory = async (name)=>{
    try {
        const newCategory = await Category.create({
            name,
            slug : name
        })
        return newCategory;
    } catch (error) {
        throw error;
    }   
}
const getCategory = async (slug)=>{
    try {
        if(!slug){
            throw createHttpError(404, "slug is required to find category")
        }

        const category = await Category.findOne({slug});
        if(!category){
            throw createHttpError(400, "category not found with this slug")
        }
        return category;
    } catch (error) {
        throw error;
    }   
}

const updateCategory = async (slug,name)=>{
    try {
        if(!slug){
            throw createHttpError(404, "slug is required to update category")
        }

        const filter = {
            slug 
        }
        const payload = {
            $set : {
                name,
                slug : name
            }
        }
        const options = {
            new : true
        }

        const updatedCategory = await Category.findOneAndUpdate(filter,payload, options).lean();
        if(!updatedCategory){
            throw createHttpError(400, "category not found with this slug")
        }

        return updatedCategory;
    } catch (error) {
        throw error;
    }   
}

const deleteCategory = async (slug)=>{
    try {
        if(!slug){
            throw createHttpError(404, "slug is required to delete category")
        }
        const filter = {
            slug 
        }
        const deleteCategory = await Category.findOneAndDelete(filter).lean();
        if(!deleteCategory){
            throw createHttpError(400, "category not found with this slug")
        }

        return deleteCategory;
    } catch (error) {
        throw error;
    }   
}
module.exports = {
    createCategory,
    getCategory,
    updateCategory,
    deleteCategory
}