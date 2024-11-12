import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { generateAccessAndRefreshTokens } from "../utils/generateTokens.js";
import jwt from "jsonwebtoken";
import validator from "validator";

const registerAsync = async (req, resp) => {
  //  get details from frontend
  const { firstName, lastName, email, password } = req.body;
  // validation checking
  if (
    [firstName, lastName, email, password].some((field) => field?.trim() === "")
  ) {
    return resp.status(400).json({ message: "Please fill all fields" });
  }
  if (!validator.isEmail(email)) {
    return resp
      .status(400)
      .json({ message: "Please enter a valid email address" });
  }

  if (password.length < 8) {
    return resp.status(400).json({ message: "please enter a strong password" });
  }

  // checking if user is already registered
  const existedUser = await User.findOne({ email });
  if (existedUser) {
    return resp.status(401).json({ message: "User is already existed" });
  }

  // checking image or avator
  const avatarlocalPath = req.file?.path;
  if (!avatarlocalPath) {
    return resp.status(400).json({ message: "Please upload an avatar" });
  }

  // uplloading it on  cloudinary
  const avatorImage = await uploadOnCloudinary(avatarlocalPath);
  if (!avatorImage) {
    return resp
      .status(400)
      .json({ message: "image is not uploaded on cloudinary" });
  }

  // creating  a new user object
  // saving user in database
  const user = await User.create({
    firstName,
    lastName,
    avator: avatorImage?.url,
    email,
    password
  });
  // removing password and refresh token form response
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  // checking for user creating
  // if not then create a new user and send a response back to frontend

  if (!createdUser) {
    return resp.status(500).json({
      success: false,
      message: "Failed to create user"
    });
  }
  //  returning response the the frontend
  return resp.status(200).json({
    success: true,
    message: "user registered successfully...",
    user: createdUser
  });
};
//user login
const loginAsync = async (req, resp) => {
  // getting data from  req.body
  const { email, password } = req.body;
  // validation on req.body fields
  if (!email || !password) {
    return resp
      .status(400)
      .json({ success: false, message: "Please enter email and password" });
  }
  // checking user existing on basis  of email
  const user = await User.findOne({ email });
  if (!user) {
    return resp
      .status(404)
      .json({ success: false, message: "user is not yet registered" });
  }
  // checking password
  const isPasswordCorrect = await user.isPasswordCorrect(password);
  if (!isPasswordCorrect) {
    return resp
      .status(401)
      .json({ success: false, message: "Invalid password" });
  }
  // sending accessToken and refreshToken to user in cookies
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );
  const loggedIn = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  await User.findByIdAndUpdate(
    user._id,
    {
      $set: { refreshToken: refreshToken }
    },
    { new: true }
  );

  // sending response to user.
  const options = {
    httpOnly: true,
    secure: false,
    sameSite: "None"
  };
  return resp
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json({
      success: true,
      message: "user loggedIn seccessfully",
      accessToken,
      refreshToken,
      loggedIn
    });
};
// user logout
const logoutAsync = async (req, resp) => {
  const _id = req.user._id;
  await User.findByIdAndUpdate(_id, {
    $set: {
      refreshToken: null
    }
  });

  const options = {
    httpOnly: true,
    secure: true
  };

  return resp
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json({
      success: true,
      message: "user logged out seccessfully"
    });
};
// getting acceccToken from refresh token
const refreshTokenAsync = async (req, resp) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;
  console.log("incomingRefreshToken", incomingRefreshToken);
  if (!incomingRefreshToken) {
    return resp
      .status(401)
      .json({ success: false, message: "unautherized request" });
  }
  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    const user = await User.findById(decodedToken?.id);
    if (incomingRefreshToken !== user?.refreshToken) {
      return resp
        .status(401)
        .json({ success: false, message: "refresh token is expired" });
    }

    if (!user) {
      return resp
        .status(401)
        .json({ success: false, message: "invalid refresh token" });
    }
    const loggedIn = await User.findById(user._id).select(
      "-password -refreshToken"
    );
    const options = {
      httpOnly: true,
      secure: false
    };

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      user._id
    );

    return resp
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({
        success: true,
        message: "access token get seccessfully",
        accessToken,
        refreshToken,
        loggedIn
      });
  } catch (error) {
    console.error("Token verification error:", error.message); // Log the specific error message
    return resp
      .status(401)
      .json({ success: false, message: "refresh token is expired or invalid" });
  }
};
// reset password
const setNewPasswordAsync = async (req, resp) => {
  const { oldPassword, newPassword } = req.body;
  //getting loggedIn user details from auth middleware
  const user = await User.findById(req.user._id);
  if (!user) {
    return resp.status(401).json({
      success: false,
      message: "invalid user"
    });
  }
  //checking old password
  console.log("oldPassword", oldPassword);
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
  if (!isPasswordCorrect) {
    return resp.status(401).json({
      success: false,
      message: "Old password not matched."
    });
  }
  //if old password is conrrect then update with new password
  user.password = newPassword;
  await user.save({ validateBeforeSave: false });
  return resp.status(200).json({
    success: true,
    message: "password changed successfully"
  });
};
//getting logged In user info
const getCurrentUserInfo = async (req, resp) => {
  return resp.status(200).json({
    user: req.user,
    success: true,
    message: "user fetched successfully"
  });
};
// changing user image
const changeUserAvator = async (req, resp) => {
  const localAvatorPath = req.file?.path;
  if (!localAvatorPath) {
    return resp.status(401).json({
      success: false,
      message: "Please upload a avator image"
    });
  }
  const clouninaryImage = await uploadOnCloudinary(localAvatorPath);
  if (!clouninaryImage.url) {
    return resp
      .status(400)
      .json({ message: "image is not uploaded on cloudinary" });
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: { avator: clouninaryImage.url }
    },
    { new: true }
  ).select("-password");
  return resp.status(200).json({
    success: true,
    message: "image uploaded on cloudinary",
    user
  });
};

const changeUserRole = async (req, resp) => {
  const { UserId, Role } = req.body;
  try {
    const updatingUser = await User.findByIdAndUpdate(
      UserId,
      {
        $set: { UserRole: Role }
      },
      { new: true } // Return the updated document
    ).select("-password");

    // Check if the user was found and updated
    if (!updatingUser) {
      return resp.status(401).json({
        success: false,
        message: "User role is not updated, user not found."
      });
    }
    return resp.status(200).json({
      success: true,
      message: "user role is updated",
      updatingUser
    });
  } catch (error) {
    return resp.status(500).json({
      success: false,
      message: "An error occurred while updating user role",
      error
    });
  }
};

export {
  registerAsync,
  loginAsync,
  logoutAsync,
  refreshTokenAsync,
  setNewPasswordAsync,
  getCurrentUserInfo,
  changeUserAvator,
  changeUserRole
};
