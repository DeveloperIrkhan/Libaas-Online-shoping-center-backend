import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true
  },
  description: {
    type: String,
    require: true
  },
  originalPrice: {
    type: Number,
    require: true
  },
  discountPrice: {
    type: Number,
    default: 0,
    require: true
  },
  productImage: {
    type: Array,
    require: true
  },
  category: {
    type: String,
    require: true
  },
  subCategory: {
    type: String,
    require: true
  },
  sizes: {
    type: Array,
    require: true
  },
  bestSeller: {
    type: Boolean,
    default: false,
    require: true
  },
  NewArrival: {
    default: false,
    type: Boolean,
    require: true
  },
  SaleOnProduct: {
    default: false,
    type: Boolean,
    require: true
  },
  date: {
    type: Number,
    require: true
  }
});

const productModel =
  mongoose.models.Products || mongoose.model("Products", productSchema);

export default productModel;
