const houseCategoryModel = require("../../models/houseCategoryModel");
const VIEW = require("../../constants/viewName")
class TypeController {
    index(req, res, next) {
        res.render(VIEW.ADD_TYPE_PAGE, { hideNavigation: true });
    }
    add(req, res, next) {
        const name = req.body.name;
        const routename = req.body.routeName;
        const newType = new houseCategoryModel({
            name: name,
            routeName: routename,
            img: req.file.path
        });
        newType.save();
        res.redirect("/");
    }

}
module.exports = new TypeController();
