const express = require("express");
const Route = express.Router();
const AdminController = require("../../controllers/admin/index.controller");

Route.get("/", AdminController.index);
Route.get("/mostvisit", AdminController.mostvisit);
Route.get("/roomsrequest", AdminController.roomsRequest);
Route.get("/contractlist", AdminController.contractlist);
Route.get("/roomlist", AdminController.roomlist);
Route.get("/message", AdminController.message);
Route.post("/roomlist/delete/:id", AdminController.roomlistDelete);
Route.post("/roomsrequest/add/:id", AdminController.roomsRequestAcept)

module.exports = Route;