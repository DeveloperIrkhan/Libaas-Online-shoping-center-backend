import mongoose from "mongoose";

export const connectionDb = () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("Connection successfully Established");
    });
    mongoose.connect(`${process.env.MONGO_DB_URI}/LibaasPK`);
  } catch (error) {
    console.error("MongoDB connection error: ", error);
  }
};

// export const connectionDb = async () => {
//   mongoose.connection.on("connected", () => {
//     console.log("Connection successfully Established");
//   });
//   await mongoose.connect(`${process.env.MONGO_DB_URI}/LibaasPK`);
// };
