import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";

//we will upload the file to server and then to cloudinary
// and unlink the file  from server after upload to cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    // uploading file on  cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto"
    });
    //console.log("file uploaded on cloundinary", response.url);
    //file had uploaded successfully  on cloudinary then delete from server
    if (fs.existsSync(localFilePath) && fs.lstatSync(localFilePath).isFile()) {
      fs.unlinkSync(localFilePath); // Remove the file from the server
      console.log("File removed from server");
    } else {
      console.log("File not found, nothing to delete");
    }
    return response;
  } catch (error) {
    console.error("Error during Cloudinary upload or file deletion:", error);
    return null;
  }
};

export { uploadOnCloudinary };
