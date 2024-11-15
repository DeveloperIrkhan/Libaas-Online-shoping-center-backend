import SubCategory from "../models/subCategory.model.js";

export const createSubCategoryController = async (req, resp) => {
  try {
    const { subCategory } = req.body;
    if (!subCategory || subCategory.trim() === "") {
      return resp
        .status(400)
        .json({ success: false, message: "Please add SubCategory" });
    }

    // checking if user is already registered
    const existingCategory = await SubCategory.findOne({
      subCategory: subCategory.toUpperCase()
    });
    if (existingCategory) {
      return resp
        .status(200)
        .json({ message: "SubCategory is already existed" });
    }
    // create new user
    const newSubCategory = await SubCategory.create({
      subCategory: subCategory.toUpperCase()
    });
    return resp
      .status(200)
      .json({
        success: true,
        message: "SubCategory created successfully",
        newSubCategory
      });
  } catch (error) {
    console.log(error);
    return resp
      .status(400)
      .json({ success: false, message: "Error! while creating Sub Category" });
  }
};

export const getAllSubCategoryController = async (req, resp) => {
  try {
    const subcategories = await SubCategory.find({});
    if (!subcategories) {
      return resp
        .status(200)
        .json({ success: false, message: "No sub categories found" });
    }
    return resp.status(200).json({
      success: true,
      subcategories,
      message: "sub categories fetched!"
    });
  } catch (error) {
    console.log(error);
  }
};
