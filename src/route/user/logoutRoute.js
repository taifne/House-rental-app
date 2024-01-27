const express = require("express");
const router = express.Router();
const LogOutController = require("../../controllers/user/LogoutController");

router.get("/", LogOutController.index);

module.exports = router;
