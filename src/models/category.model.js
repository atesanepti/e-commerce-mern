//External Dependencies
const { Schema, model } = require("mongoose");


//Internal Dependencies
const { slugfy } = require("../utilities/string");

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "category name is required"],
      trim: true,
      minlength: [3, "category name must be minimum 3 characters"],
      maxlength: [25, "category name must be maximum 25 characters"],
    },
    slug : {
      type : String,
      required: [true, "category slug is required"],
      unique : true,
      lowercase : true,
      set : (name)=>{
        return slugfy(name)
      }
    }
   
  },
  { timestamps: true }
);


const Category = new model("category", categorySchema);

module.exports = Category
