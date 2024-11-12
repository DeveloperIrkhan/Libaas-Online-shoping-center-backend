import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

const generateAccessToken = (id) => {
  return jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY
  });
};
const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY
  });
};

export const generateAccessAndRefreshTokens = async (id) => {
  try {
    const user = await User.findById(id);
    if (!user) {
      throw new Error("User not found");
    } else {
      const accessToken = generateAccessToken(user._id);
      const refreshToken = generateRefreshToken(user._id);

      user.refreshToken = refreshToken;
      await user.save({ validateBeforeSave: false });

      return { accessToken, refreshToken };
    }
  } catch (error) {
    throw error;
  }
};
