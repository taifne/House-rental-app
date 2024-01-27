const userModel = require("../../models/userModel");
const houseModel = require("../../models/houseModel");
const ratingModel = require("../../models/ratingModel");
const userService = require("../../service/userService");
const VIEW = require("../../constants/viewName")
const COOKIE_VALUE = require("../../constants/cookieValue");
class UserController {
    //[Get] /user/avatar
    setavatar(req, res, next) {
        res.render(VIEW.UPDATE_AVATAR_PAGE, { hideNavigation: true });
    }
    //[Post] /user/avatar
    async saveAvatar(req, res, next) {
        try {
            let user = await userService.updateUser(req.cookies.user_id, { avatar: req.file.path });
            res.cookie(COOKIE_VALUE.USER_AVATAR, req.file.path);
            if (user.autherized !== false) {
                res.redirect("/");
            }
            else {
                res.redirect(`/user/validemail/${user._id}`);
            }
        }
        catch (err) {
            throw err;
        }
    }
    //[Get]/user/personaldetail/:id
    async getPersonaldetail(req, res, next) {
        let personalroom = await houseModel.find({ host: req.params.id }, { _id: 1, img: 1 }).limit(4).lean();
        let rating = await ratingModel.find({ host: req.params.id }).populate("owner").lean();
        let isOwner = (req.params.id === req.cookies.user_id && req.cookies.user_id) ? true : false;
        let personaldetail = await userModel.findOne({ _id: req.params.id }, {
            description: 1,
            language: 1,
            habit: 1,
            role: 1,
            avatar: 1,
            fullName: 1,
            email: 1,
            phoneNumber: 1,
            numberOfjudgement: 1,
            introduce: 1
        });

        res.render(VIEW.PROFILE_PAGE, {
            ratings: rating,
            isOwner,
            role: personaldetail.role,
            avatar: personaldetail.avatar,
            name: personaldetail.fullName,
            email: personaldetail.email,
            phone: personaldetail.phoneNumber,
            evaluate: personaldetail.numberOfjudgement,
            introduce: personaldetail.introduce,
            rooms: personalroom,
            PersonId: req.params.id,
            UserId: req.cookies.user_id,
            description: personaldetail.description,
            language: personaldetail.language,
            habit: personaldetail.habit,

        })


    }

    async getPersonaldetailUpdate(req, res, next) {

        const filter = { _id: req.params.id };

        const update = { ...req.body };

        userService.updateUser(filter, update).then(() => {
            res.redirect("/user/personaldetail/" + req.params.id)
        }).catch(err => { });
    }



    async updatePersonalAddress(req, res, next) {
        const filter = { _id: req.cookies.user_id };

        const update = { ...req.body };
        userService.updateUser(filter, update).then(() => {

            res.redirect("/");

        }).catch(err => { });
    }

}
module.exports = new UserController();