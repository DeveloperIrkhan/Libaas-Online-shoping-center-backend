import { Router } from "express";
import {
  createProductAsync,
  updateProductAsync,
  GetProductsAsync,
  getProductAsync,
  deleteProductAsync
} from "../controllers/product.controller.js";
import { fileUpload } from "../middleware/multer.middleware.js";
import { IsAdmin } from "../middleware/IsAdmin.middleware.js";

const productRoutes = new Router();

productRoutes.route("/get-product/:id").get(getProductAsync);
productRoutes.route("/get-products").post(GetProductsAsync);
//secure routes
productRoutes.route("/create-product").post(
  fileUpload.fields([
    { name: "productImage0", maxCount: 1 },
    { name: "productImage1", maxCount: 1 },
    { name: "productImage2", maxCount: 1 },
    { name: "productImage3", maxCount: 1 }
  ]),
  createProductAsync
);
productRoutes.route("/update-product").post(IsAdmin, updateProductAsync);
productRoutes.route("/delete-product").post(IsAdmin, deleteProductAsync);

export default productRoutes;
