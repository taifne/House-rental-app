const indexRoute = require("./user/index.route");
const houseRoute = require("./user/house.route");
const hostRoute = require("./user/host.route");
const registerRoute = require("./user/register.route");
const loginRoute = require("./user/login.route");
const logoutRoute = require("./user/logout.route");
const userRoute = require("./user/user.route");
const categoryRoute = require("./user/category.route");
const accountRoute = require("./user/account.route");
const adminRoute = require("./admin/index.route");
const rateRoute=require("./user/rate.route")
const wishlistRoute = require("./user/wishlist.route");
const reservationRoute=require("./user/register.route")
function Route(App) {
  App.use("/register", registerRoute);
  App.use("/login", loginRoute);
  App.use("/rooms", houseRoute);
  App.use("/host", hostRoute);
  App.use("/logout", logoutRoute);
  App.use("/category", categoryRoute);
  App.use("/user", userRoute);
  App.use("/account",accountRoute);
  App.use("/", indexRoute);
  App.use("/admin", adminRoute)
  App.use("/rating",rateRoute);
  App.use("/wishlist",wishlistRoute);
  App.use("/reservation",reservationRoute);

}
module.exports = Route;
