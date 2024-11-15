import Category from "../models/category.model.js";

export const createCategoryController = async (req, resp) => {
  try {
    const { category } = req.body;
    if (!category || category.trim() === "") {
      return resp
        .status(400)
        .json({ success: false, message: "Please add Category" });
    }

    // checking if user is already registered
    const existingCategory = await Category.findOne({
      category: category.toUpperCase()
    });
    console.log(existingCategory);
    if (!existingCategory) {
      // create new user
      // const newCategory = new Category(category);
      // await newCategory.save();
      const newCategory = await Category.create({
        category: category.toUpperCase()
      });
      return resp.status(200).json({
        success: true,
        message: "Category created successfully",
        newCategory
      });
    }
    return resp.status(200).json({
      success: false,
      message: "Category is already existed"
    });
  } catch (error) {
    console.log(error);
    return resp
      .status(400)
      .json({ success: false, message: "Error! while creating category" });
  }
};

export const getAllCategoryController = async (req, resp) => {
  try {
    const categories = await Category.find({});
    if (!categories) {
      return resp
        .status(200)
        .json({ success: false, message: "No categories found" });
    }
    return resp.status(200).json({
      success: true,
      categories,
      message: "categories fetched!"
    });
  } catch (error) {
    console.log(error);
  }
};
