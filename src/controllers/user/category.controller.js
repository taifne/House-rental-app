const houseCategoryModel = require("../../models/catefory.model");
const VIEW = require("../../constants/viewName");

class TypeController {
  index(req, res, next) {
    res.render(VIEW.ADD_TYPE_PAGE, { hideNavigation: true });
  }

  async add(req, res, next) {
    try {
      const { name, routeName } = req.body;
      const newType = new houseCategoryModel({
        name,
        routeName,
        img: req.file.path
      });
      await newType.save();
      res.redirect("/");
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new TypeController();
