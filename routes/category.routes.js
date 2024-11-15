import { Router } from "express";
import { createCategoryController, getAllCategoryController } from "../controllers/category.controller.js";

const categoryRoute = new Router();
categoryRoute.route("/create-category").post(createCategoryController)
categoryRoute.route("/get-categorys").get(getAllCategoryController)

export default categoryRoute;
