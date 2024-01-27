const express = require("express");
const router = express.Router();
const userController = require("../../controllers/user/UserController");
const cloudinary = require("../../config/cloudinary");
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const multer = require("multer");
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  folder: 'avatar',
  allowedFormats: ['jpg', 'png', 'jpeg'],
  transformation: [{ width: 500, height: 500, crop: 'limit' }],
});
var upload = multer({ storage: storage }).single("productImg");


var upload = multer({ storage: storage }).single("productImg");
router.get("/avatar", userController.setavatar);
router.post("/avatar", upload, userController.saveAvatar);
router.post("/info", userController.updatePersonalAddress);
router.get("/:id", userController.getPersonaldetail);
router.post("/:id", userController.getPersonaldetailUpdate);

module.exports = router;
