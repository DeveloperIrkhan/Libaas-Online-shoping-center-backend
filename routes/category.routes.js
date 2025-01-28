import { Router } from "express";
import {
  createCategoryController,
  getAllCategoryController,
  getCategoryById,
  RemoveCategoryByIdController,
  UpdateCategoryByIdController
} from "../controllers/category.controller.js";
import { IsAdmin } from "../middleware/IsAdmin.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const categoryRoute = new Router();
categoryRoute.route("/create-category").post(createCategoryController);
categoryRoute.route("/get-categorys").get(getAllCategoryController);
categoryRoute.route("/get-category/:id").get(getCategoryById);
categoryRoute
  .route("/remove-category/:id")
  .delete(verifyJWT, IsAdmin, RemoveCategoryByIdController);
categoryRoute
  .route("/update-category/:id")
  .post(verifyJWT, IsAdmin, UpdateCategoryByIdController);

export default categoryRoute;
