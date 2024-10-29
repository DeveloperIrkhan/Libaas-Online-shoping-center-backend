import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { generateAccessAndRefreshTokens } from "../utils/generateTokens.js";
const registerAsync = async (req, resp) => {
  // if not then create a new user and send a response back to frontend
  // removing password and refresh token form response
  //  returning response the the frontend

  //  get details from frontend
  const { firstName, lastName, email, password } = req.body;
  // validation checking
  if (
    [firstName, lastName, email, password].some((field) => field?.trim() === "")
  ) {
    return resp.status(400).json({ message: "Please fill all fields" });
  }

  // checking if user is already registered
  const existedUser = await User.findOne({ email });
  if (existedUser) {
    return resp.status(409).json({ message: "User is already existed" });
  }

  // checking image or avator
  const avatarlocalPath = req.file?.path;
  // const  avatar = req.files?.avator[0].path;
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
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  // checking for user creating
  if (!createdUser) {
    return resp.status(500).json({
      success: false,
      message: "Failed to create user"
    });
  }
  return resp.status(200).json({
    message: "user registered successfully...",
    user: createdUser
  });
};
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
  const isPasswordCorrect = await user.isPasswordCorrrect(password);
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
      message: "user loggedOut seccessfully"
    });
};

export { registerAsync, loginAsync, logoutAsync };
