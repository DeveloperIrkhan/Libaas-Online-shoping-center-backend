import mongoose from "mongoose";

export const connectionDb = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("Connection successfully Established");
    });
    await mongoose.connect(`${process.env.MONGO_DB_URI}/LibaasPK`);
  } catch (error) {
    console.error("MongoDB connection error: ", error);
  }
};
