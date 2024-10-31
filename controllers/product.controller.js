import productModel from "../models/product.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const createProductAsync = async (req, resp) => {
  try {
    const {
      name,
      description,
      price,
      category,
      subCategory,
      sizes,
      bestSeller
    } = req.body;
    if (
      [name, description, price, category, subCategory, sizes, bestSeller].some(
        (field) => field?.trim() === ""
      )
    ) {
      return resp.status(400).json({ message: "Please fill all fields" });
    }
    const productImage0 = req.files.productImage0 && req.files.productImage0[0];
    const productImage1 = req.files.productImage1 && req.files.productImage1[0];
    const productImage2 = req.files.productImage2 && req.files.productImage2[0];
    const productImage3 = req.files.productImage3 && req.files.productImage3[0];
    console.log("productImage0", productImage0.filename);
    console.log("productImage1", productImage1.filename);
    console.log("productImage2", productImage2.filename);
    console.log("productImage3", productImage3.filename);
    const ImageArray = [
      productImage0,
      productImage1,
      productImage2,
      productImage3
    ].filter((item) => item !== undefined);
    const Images = await Promise.all(
      ImageArray.map(async (item) => {
        let result = await uploadOnCloudinary(item.path);
        return result.secure_url;
      })
    );
    if (!Images.length) {
      return resp
        .status(400)
        .json({ message: "images is not uploaded on cloudinary" });
    }
    const productData = {
      name,
      description,
      price: Number(price),
      productImage: Images,
      category,
      subCategory,
      sizes: JSON.parse(sizes),
      bestSeller: bestSeller === "true" ? true : false,
      date: Date.now()
    };
    const product = new productModel(productData);
    await product.save();

    return resp.status(200).json({
      success: true,
      message: "item added successfully"
    });
  } catch (error) {
    console.log(error);
    return resp
      .status(400)
      .json({ success: false, message: "Something went wrong", error });
  }
};
const updateProductAsync = async (req, resp) => {};
const GetProductsAsync = async (req, resp) => {};
const getProductAsync = async (req, resp) => {
  const productId = req.params.id;
  const product = await productModel.findById(productId);
  if (!product) {
    return resp
      .status(404)
      .json({ success: false, message: "product not found" });
  }
  return resp.status(200).json({
    success: true,
    message: "product fetched successfully",
    product
  });
};
const deleteProductAsync = async (req, resp) => {};

export {
  createProductAsync,
  updateProductAsync,
  GetProductsAsync,
  getProductAsync,
  deleteProductAsync
};
