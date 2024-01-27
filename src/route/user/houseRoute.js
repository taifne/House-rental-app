const express = require("express");
const Route = express.Router();
const ProductController = require("../../controllers/user/HouseController")


Route.get("/:id", ProductController.specific);

module.exports = Route;
