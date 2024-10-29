import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyJWT = async (req, resp, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.headers("authorization")?.replace("Bearer ", "");
    // req.headers("Authorization")?.replace("Bearer ", "");
    if (!token)
      return resp.status(401).send({
        success: false,
        message: "Unauthorized request"
      });

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const findedUser = await User.findById(decodedToken._id).select(
      "-password -refreshToken"
    );
    if (!findedUser) {
      // NEXT_TASK discuss
      console.log(error);
      return resp.status(401).send({
        success: false,
        message: "invalid token",
        error
      });
    }
    req.user = findedUser;
    next();
  } catch (error) {
    return resp.status(401).send({
      success: false,
      message: "invalid access token",
      error
    });
  }
};
