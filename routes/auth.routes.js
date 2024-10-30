import { Router } from "express";
import {
  changeUserAvator,
  changeUserRole,
  getCurrentUserInfo,
  loginAsync,
  logoutAsync,
  refreshTokenAsync,
  registerAsync,
  setNewPasswordAsync
} from "../controllers/auth.controller.js";
import { fileUpload } from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { IsAdmin } from "../middleware/IsAdmin.middleware.js";
const authRouter = Router();

authRouter.route("/register").post(fileUpload.single("avator"), registerAsync);

// this is used for multiple files upload
// authRouter.route("/register").post(fileUpload.fields([
//     { name: "avator", maxCount: 1 },
// ]), registerAsync);

authRouter.route("/login").post(loginAsync);
authRouter.route("/get-refresh-token").get(refreshTokenAsync);

//secure routes
authRouter.route("/logout").post(verifyJWT, logoutAsync);
authRouter.route("/forgot-password").post(verifyJWT, setNewPasswordAsync);
authRouter.route("/user-info").get(verifyJWT, getCurrentUserInfo);
authRouter.route("/change-role").post(verifyJWT, IsAdmin, changeUserRole);
authRouter
  .route("/change-avator")
  .post(fileUpload.single("avator"), verifyJWT, changeUserAvator);
//authRouter.post("/register", registerAsync);

export default authRouter;
