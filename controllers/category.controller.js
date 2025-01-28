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
export const RemoveCategoryByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      return res.status(200).json({
        success: true,
        message: "category not found"
      });
    }
    return res.status(200).json({ success: true, message: "category removed" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "something went wrong."
    });
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const existingCategory = await Category.findById(id);
    if (!existingCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    return res.status(200).json({
      success: true,
      message: "category found",
      category: existingCategory
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: `something went wrong, ${error}`
    });
  }
};
export const UpdateCategoryByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Id", id);
    const { updateCategory } = req.body;
    console.log("category", updateCategory);
    const existingCategory = await Category.findById(id);
    if (!existingCategory) {
      return res.status(404).json({ message: "Category not found" });
    }
    if ([updateCategory].some((field) => field?.trim() === "")) {
      return res.status(400).json({ message: "Please fill all fields" });
    }
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      {
        $set: { category: updateCategory }
      },
      {
        new: true
      }
    );

    return res.status(200).json({
      success: true,
      message: "category Updated successfully",
      category: updatedCategory
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: `category not updated, ${error}`
    });
  }
};
