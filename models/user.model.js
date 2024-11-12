import mongoose, { Schema } from "mongoose";
import bycrpt from "bcrypt";
import jwt from "jsonwebtoken";
import { userRoleEnums } from "../enums/userRoles.js";

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      require: [true, "firstname is required!"],
      unique: false,
      lowercase: true,
      trim: true
    },
    lastName: {
      type: String,
      require: false,
      unique: false,
      lowercase: true,
      trim: true
    },
    UserRole: {
      type: Number,
      require: true,
      default: userRoleEnums.USER
    },

    email: {
      type: String,
      require: [true, "email is required!"],
      unique: true,
      lowercase: true,
      trim: true
    },
    avator: {
      type: String, //url cloudinary
      require: [true, "avator is required!"]
    },
    password: {
      type: String,
      require: [true, "password is required!"]
    },
    refreshToken: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);
// the following is used for password hashing while saving.
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const saltRounds = await bycrpt.genSalt(10);
  this.password = await bycrpt.hash(this.password, saltRounds);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  if (!password || !this.password) {
    console.log("Old Password:", password);
    console.log("Hashed Password from DB:", this.password);
    throw new Error("password compare failed: invalid data");
  }
  return await bycrpt.compare(password, this.password);
};

// userSchema.methods.generateAccessToken = function () {
//   return jwt.sign({ _id: this._id }, process.env.ACCESS_TOKEN_SECRET, {
//     expiresIn: process.env.ACCESS_TOKEN_EXPIRY
//   });
// };
// userSchema.methods.generateRefreshToken = function () {
//   return jwt.sign({ _id: this._id }, process.env.REFRESH_TOKEN_SECRET, {
//     expiresIn: process.env.REFRESH_TOKEN_EXPIRY
//   });
// };

export const User = mongoose.model("User", userSchema);
