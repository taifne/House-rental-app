const express = require("express");
const router = express.Router();
const AccountController = require("../../controllers/user/AccountController");
router.post("/password", AccountController.sendPassword);
router.get("/password",AccountController.getPassword);
router.post("/user-name",AccountController.updatePersonalName); 
router.post("/user-phone",AccountController.updatePersonalPhone);
router.post("/user-address",AccountController.updatePersonalAddress);
router.get("/validemail/:id", AccountController.validEmail);
router.post("/validemail/:id",AccountController.sendVerifyEmail, AccountController.validateEmail);
module.exports = router;
