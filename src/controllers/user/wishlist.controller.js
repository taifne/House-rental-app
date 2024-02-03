const WishlistModel = require("../../models/wishlist.model");
const HouseModel = require("../../models/house.model");
const VIEW = require("../../constants/viewName");

class WishlistController {
    async addCollection(req, res, next) {
        try {
            const newWishlistItem = new WishlistModel({
                name: req.body.name,
                user: req.cookies.user_id,
                room: []
            });
            await newWishlistItem.save();
            res.redirect("/");
        } catch (error) {
            next(error);
        }
    }

    async updateWishlist(req, res, next) {
        try {
            const houseForUpdateWishlist = await HouseModel.findOne({ _id: req.body.roomId }).lean();
            await WishlistModel.findByIdAndUpdate(
                req.params.id,
                { $push: { room: req.body.roomId, display: houseForUpdateWishlist.img[0] } }
            );
            res.redirect("/");
        } catch (error) {
            next(error);
        }
    }

    async getWishlist(req, res, next) {
        try {
            if (req.cookies.token) {
                const user_name = req.cookies.user_name;
                const user_email = req.cookies.user_email;
                const user_phone = req.cookies.user_phone;
                const user_avatar = req.cookies.user_avatar;
                const wish = await WishlistModel.find({ user: req.cookies.user_id }).lean();
                res.render(VIEW.USER_WISHLIST_PAGE, {
                    user_name,
                    user_email,
                    user_phone,
                    user_avatar,
                    wish,
                    islogged: true
                });
            } else {
                res.redirect('/login');
            }
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new WishlistController();
