import { Router } from "express";
import {
  createSubCategoryController,
  getAllSubCategoryController
} from "../controllers/subCategory.controller.js";

const SubCategoryRoute = new Router();

SubCategoryRoute.route("/create-subcategory").post(createSubCategoryController);
SubCategoryRoute.route("/get-all-subcategory").get(getAllSubCategoryController);
export default SubCategoryRoute;
