import { Router } from "express";
import {
  loginAsync,
  logoutAsync,
  registerAsync
} from "../controllers/auth.controller.js";
import { fileUpload } from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
const authRouter = Router();

authRouter.route("/register").post(fileUpload.single("avator"), registerAsync);

// this is used for multiple files upload
// authRouter.route("/register").post(fileUpload.fields([
//     { name: "avator", maxCount: 1 },
// ]), registerAsync);

authRouter.route("/login").post(loginAsync);

//secure routes
authRouter.route("/logout").post(verifyJWT, logoutAsync);
//authRouter.post("/register", registerAsync);

export default authRouter;
