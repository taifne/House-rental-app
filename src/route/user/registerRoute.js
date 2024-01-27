const express = require("express");
const router = express.Router();
const ResisterRouter = require("../../controllers/user/RegisterController");


router.get("/", ResisterRouter.index);
router.post("/", ResisterRouter.checkEmailExist, ResisterRouter.load);
module.exports = router;