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
