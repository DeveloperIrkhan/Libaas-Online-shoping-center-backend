import mongoose from "mongoose";

export const connectionDb = async () => {
  try {
    await mongoose.connect(`${process.env.MONGO_DB_URI}/LibaasPK`);
    console.log("Connection successfully Established");
  } catch (error) {
    console.error("MongoDB connection error: ", error);
  }
  0;
  3;
};
