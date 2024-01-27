const wislistModel = require("../../models/wishlistModel");
const houseModel = require("../../models/houseModel");
const VIEW = require("../../constants/viewName")
class WishlistController {
    //[Post] /wishlist/collection
    addCollection(req, res, next) {
        const love = new wislistModel({
            name: req.body.name,
            user: req.cookies.user_id,
            room: []
        });
        love.save();
        res.redirect("/");

    }
    async updateWishlist(req, res, next) {
        try {
            let houseForUpdateWishlist = await houseModel.find({ _id: req.body.roomId }).lean()
            await wislistModel.findByIdAndUpdate(
                req.params.id,
                { $push: { room: req.body.roomId, display: houseForUpdateWishlist[0].img[0] } },
                function (err, docs) {
                    if (err) {
                        console.log(err);
                    } else {
                        res.redirect("/");
                    }
                }
            )


        }
        catch (error) {
            console.log(error);
        }


    }
    getWishlist(req, res, next) {

        let logged;

        if (req.cookies.token) {
            logged = true;
        }
        else {
            logged = false;
            redirect('/login')
        }
        let user_name = req.cookies.user_name;
        let user_email = req.cookies.user_email;
        let user_phone = req.cookies.user_phone;
        let user_avatar = req.cookies.user_avatar;
        wislistModel.find({ user: req.cookies.user_id }).lean().then(wish => {

            res.render(VIEW.USER_WISHLIST_PAGE, {
                user_name,
                user_email,
                user_phone,
                user_avatar,
                wish,
                islogged: logged
            });
        }).catch(err => console.log(err))
    }


}
module.exports = new WishlistController();