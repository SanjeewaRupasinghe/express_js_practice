import multer from "multer";

export const storage = multer.diskStorage({
  destination: "uploads",
  filename: function (req, file, cb) {
    cb(null,file.fieldname + "-" + Date.now() + "-" + file.originalname);
  },
});
