import productModel from "../models/product.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

/* creating new product  */
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

/* getting one product  */
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

/* getting all products */
const GetProductsAsync = async (req, resp) => {
  try {
    const products = await productModel.find({}).sort({ date: -1 });
    if (!products) {
      return resp
        .status(404)
        .json({ success: false, message: "products not found" });
    }
    console.log(products);
    return resp.status(200).json({
      success: true,
      message: "product fetched successfully",
      products
    });
  } catch (error) {
    return resp.status(400).json({
      success: false,
      message: "products not found",
      error: error.message
    });
  }
};
/* Updating the existing product */
const updateProductAsync = async (req, resp) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      price,
      category,
      subCategory,
      sizes,
      bestSeller
    } = req.body;

    const existingProduct = await productModel.findById(id);
    if (!existingProduct) {
      return resp.status(404).json({ message: "Product not found" });
    }

    // Check for empty fields if required fields are being updated
    if (
      [name, description, price, category, subCategory, sizes, bestSeller].some(
        (field) => field?.trim() === ""
      )
    ) {
      return resp.status(400).json({ message: "Please fill all fields" });
    }

    const productImages = [
      "productImage0",
      "productImage1",
      "productImage2",
      "productImage3"
    ];
    const newImageArray = productImages
      .map((image) => req.files[image]?.[0])
      .filter((img) => img != undefined);
    let Images;
    if (newImageArray.length > 0) {
      Images = await Promise.all(
        newImageArray.map(async (item) => {
          let result = await uploadOnCloudinary(item.path);
          return result.secure_url;
        })
      );
    } else {
      // Keep existing images if no new ones are uploaded
      Images = existingProduct.productImage;
    }
    // Update product data
    const updatedData = {
      name: name || existingProduct.name,
      description: description || existingProduct.description,
      price: price ? Number(price) : existingProduct.price,
      productImage: Images,
      category: category || existingProduct.category,
      subCategory: subCategory || existingProduct.subCategory,
      sizes: sizes ? JSON.parse(sizes) : existingProduct.sizes,
      bestSeller:
        bestSeller !== undefined
          ? bestSeller === "true"
          : existingProduct.bestSeller,
      date: Date.now() // Update date to the current time
    };

    const updatedProduct = await productModel.findByIdAndUpdate(
      id,
      updatedData,
      {
        new: true
      }
    );

    return resp.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct
    });
  } catch (error) {
    console.log(error);
    return resp.status(400).json({
      success: false,
      message: "Something went wrong",
      error: error.message || error
    });
  }
};

const deleteProductAsync = async (req, resp) => {
  const { id } = req.params;
  const product = await productModel.findByIdAndDelete(id);
  if(!product){
    return resp.status(404).json({
    success:false,
    message:"product not found"
    })
  }
  return resp.status(200).json({ success: true, message: "product removed" });
};

export {
  createProductAsync,
  updateProductAsync,
  GetProductsAsync,
  getProductAsync,
  deleteProductAsync
};
