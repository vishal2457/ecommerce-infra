const multer = require("multer");
const excelFiles = "/public/excelFiles";
const images = "/public/resources";

const getFileStorage = (path) => {
  return multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, process.cwd() + path);
    },
    filename: function (req, file, cb) {
      var d = new Date();
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  });
};

const imageFilter = function (req, file, cb) {
  // accept image only
  if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
    return cb(new Error("Only image files or pdf are allowed!"), false);
  }
  cb(null, true);
};

const imageUpload = multer({
  storage: getFileStorage(images),
  // fileFilter: imageFilter,
});
const fileUpload =  multer({ storage: getFileStorage(excelFiles) });
module.exports = { fileUpload, imageUpload };
