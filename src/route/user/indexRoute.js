const express = require("express");
const Route = express.Router();
const Home = require("../../controllers/user/IndexController");

Route.get("/", Home.defaultDisplay);
module.exports = Route;