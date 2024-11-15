import mongoose, { Schema } from "mongoose";

const subCategory = new Schema({
  subCategory: {
    type: String,
    required: true,
    unique: true
  }
});

const SubCategory =
  mongoose.models.subCategory || mongoose.model("subCategory", subCategory);
export default SubCategory;
