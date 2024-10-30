import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, callBack) {
    callBack(null, "./uploads");
  },
  filename: function (req, file, callBack) {
    const uniqueSuffix = Date.now();
    callBack(null, uniqueSuffix + "_" + file.originalname);
  }
});

export const fileUpload = multer({ storage });
/*
const multerStorage = multer.diskStorage({
  filename: function (req, file, callback) {
    callback(null, file.originalname);
  }
});
const fileUploads = multer({ multerStorage });
export default fileUploads;
*/
// shift alt A
