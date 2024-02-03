const indexRoute = require("./user/indexRoute");
const houseRoute = require("./user/houseRoute");
const hostRoute = require("./user/hostRoute");
const registerRoute = require("./user/registerRoute");
const loginRoute = require("./user/loginRoute");
const logoutRoute = require("./user/logoutRoute");
const userRoute = require("./user/userRoute");
const addType = require("./admin/addtype");
const accountRoute = require("./user/accountRoute");
const adminRoute = require("./admin/index.admin.route");
const rateRoute=require("./user/rateRoute")
const wishlistRoute = require("./user/wishlistRoute");
const reservationRoute=require("./user/registerRoute")
function Route(App) {
  App.use("/register", registerRoute);
  App.use("/login", loginRoute);
  App.use("/rooms", houseRoute);
  App.use("/host", hostRoute);
  App.use("/logout", logoutRoute);
  App.use("/category", addType);
  App.use("/user", userRoute);
  App.use("/account",accountRoute);
  App.use("/", indexRoute);
  App.use("/admin", adminRoute)
  App.use("/rating",rateRoute);
  App.use("/wishlist",wishlistRoute);
  App.use("/reservation",reservationRoute);

}
module.exports = Route;
