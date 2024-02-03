// Author: [Taine]
const userModel = require("../../models/user.model");
const houseModel = require("../../models/house.model");
const ratingModel = require("../../models/rate.model");
const userService = require("../../service/user.service");
const VIEW = require("../../constants/viewName");
const COOKIE_VALUE = require("../../constants/cookieValue");
class UserController {
  // Display the page to set the user's avatar
  async setAvatar(req, res, next) {
    res.render(VIEW.UPDATE_AVATAR_PAGE, { hideNavigation: true });
  }

  // Save the user's avatar
  async saveAvatar(req, res, next) {
    try {
      // Update the user's avatar in the database and set a cookie with the user's avatar path
      let user = await userService.updateUser(req.cookies.user_id, { avatar: req.file.path });
      res.cookie(COOKIE_VALUE.USER_AVATAR, req.file.path);
      // Redirect the user based on their authorization status
      const redirectPath = (user.autherized !== false) ? "/" : `/user/validemail/${user._id}`;
      res.redirect(redirectPath);
    } catch (err) {
      next(err);
    }
  }

  // Get a user's personal details
  async getPersonalDetail(req, res, next) {
    try {
      // Retrieve the user's personal details, associated ratings, and hosted rooms from the database
      const personalRoom = await houseModel.find({ host: req.params.id }, { _id: 1, img: 1 }).limit(4).lean();
      const rating = await ratingModel.find({ host: req.params.id }).populate("owner").lean();
      const isOwner = (req.params.id === req.cookies.user_id && req.cookies.user_id) ? true : false;
      const personalDetail = await userModel.findOne({ _id: req.params.id }, "description language habit role avatar fullName email phoneNumber numberOfjudgement introduce").lean();

      // Render the PROFILE_PAGE view with the retrieved data
      res.render(VIEW.PROFILE_PAGE, {
        ratings: rating,
        isOwner,
        role: personalDetail.role,
        avatar: personalDetail.avatar,
        name: personalDetail.fullName,
        email: personalDetail.email,
        phone: personalDetail.phoneNumber,
        evaluate: personalDetail.numberOfjudgement,
        introduce: personalDetail.introduce,
        rooms: personalRoom,
        PersonId: req.params.id,
        UserId: req.cookies.user_id,
        description: personalDetail.description,
        language: personalDetail.language,
        habit: personalDetail.habit
      });
    } catch (err) {
      next(err);
    }
  }

  // Update a user's personal details
  async updatePersonalDetail(req, res, next) {
    try {
      const filter = { _id: req.params.id };
      const update = req.body;
      // Update the user's personal details in the database
      await userService.updateUser(filter, update);
      // Redirect the user to their personal details page
      res.redirect("/user/personaldetail/" + req.params.id);
    } catch (err) {
      next(err);
    }
  }

  // Update a user's personal address
  async updatePersonalAddress(req, res, next) {
    try {
      const filter = { _id: req.cookies.user_id };
      const update = req.body;
      // Update the user's address in the database
      await userService.updateUser(filter, update);
      // Redirect the user to the home page
      res.redirect("/");
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new UserController();
