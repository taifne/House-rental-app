const express = require("express");
const router = express.Router();
const ReservationController = require("../../controllers/user/ReservationController");


Route.get("/:id",ReservationController.getUserReservation)
Route.post("/payment", ReservationController.payment);
Route.get("/payment/success", ReservationController.success);
module.exports = router;
