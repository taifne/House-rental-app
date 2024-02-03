const express = require("express");
const Route = express.Router();
const HouseController = require("../../controllers/user/HouseController")
const cloudinary = require("../../config/cloudinary");
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const multer = require("multer");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  folder: 'product',
  allowedFormats: ['jpg', 'png', 'jpeg'],
  transformation: [{ width: 500, height: 500, crop: 'limit' }],
});
var upload = multer({ storage: storage }).array("productImg", 12);

Route.get("/edit", HouseController.Index);
Route.get("/edit/:id", HouseController.GerHouseDetails);
Route.get("/title", HouseController.DisplayTitle);
Route.post("/title", HouseController.SaveTitle);
Route.get("/detail", HouseController.DisplayDetail);
Route.post("/detail", HouseController.SaveDetail);
Route.get("/photos", HouseController.DisplayPhotos);
Route.post("/photos", upload, HouseController.SavePhotos);
Route.get("/price", HouseController.DisplayPrice);
Route.post("/price", HouseController.SaveNewRoom);
Route.get("/:id", HouseController.specific);

module.exports = Route;
