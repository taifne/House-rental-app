const houseModel = require("../../models/houseModel");
const houseCategoryModel = require("../../models/houseCategoryModel");
const userModel = require("../../models/userModel");
const ROLE=require("../../constants/role")
const cookieValue = require("../../constants/cookieValue");
const VIEW_NAME=require("../../constants/viewName")
class RoomController {
    //GET /host/room
    Index(req, res, next) {
        res.render("Overview", { hideNavigation: true });
    }
    //GET /host/room/title
    DisplayTitle(req, res, next) {
        let isAdmin = false;
        if (!req.cookies.token) {
            res.redirect("/login");
        }
        if (req.cookies.user_role) {
            isAdmin = req.cookies.user_role === "admin" ? true : false;
        }
        else { isAdmin = false; }
        houseCategoryModel.find({ gender: req.params.gender })
            .then((items) => {
                items = items.map((item) => item.toObject());

                res.render(VIEW_NAME.ADD_HOUSE_TITLE_PAGE, { items, hideNavigation: true, process: 0 });
            })
            .catch((err) => res.json(err));


    }
    //GET /host/room/detail
    DisplayDetail(req, res, next) {

        res.render(VIEW_NAME.ADD_HOUSE_DETAIL_PAGE, { hideNavigation: true, process: 25 });
    }
    //GET /host/room/photos
    DisplayPhotos(req, res, next) {
        res.render(VIEW_NAME.ADD_HOUSE_PHOTO_PAGE, { hideNavigation: true, process: 50 });
    }
    //GET /host/room/price
    DisplayPrice(req, res, next) {
        res.render(VIEW_NAME.ADD_HOUSE_PRICE_PAGE, { hideNavigation: true, process: 75 });
    }
    //[POST]  /host/room/title
    SaveTitle(req, res, next) {
        res.cookie(cookieValue.HOUSE_NAME, req.body.name);
        res.cookie(cookieValue.HOUSE_CATEGORY, req.body.type);
        res.redirect("/host/room/detail");
    }
    // [POST] /host/room/detail
    SaveDetail(req, res, next) {

        res.cookie(cookieValue.HOUSE_MAX_CUSTOMER, req.body.maximumcus);

        res.cookie(cookieValue.HOUSE_AVAILABLE_BED, req.body.bed);
        res.cookie(cookieValue.HOUSE_AVAILABLE_SHOWER, req.body.shower);

        res.cookie(cookieValue.HOUSE_ADDRESS, req.body.address);


        res.redirect("/host/room/photos");
    }
    // [POST] /host/room/photos
    SavePhotos(req, res, next) {
        const love = req.files.map(e => e.path);
        res.cookie(cookieValue.HOUSE_IMAGES, love);
        res.redirect("/host/room/price");
    }
    // [POST] /host/room/price
    async SaveNewRoom(req, res, next) {
        await userModel.findOne({ _id: req.cookies.user_id })
            .then((user) => {

                user.role = ROLE.HOST
                user.save();

            })
            .catch((err) => res.json(err));
        const newProduct = new houseModel({
            name: req.cookies.user_name,
            host: req.cookies.user_id,
            startday: req.body.startday,
            endday: req.body.endday,
            maximuncus: req.cookies.maximumcus,
            price: req.body.price,
            type: req.cookies.house_category,
            bed: req.cookies.house_available_bed,
            shower: req.cookies.house_available_shower,
            hosthome: true,
            img: req.cookies.house_images,
            display: req.cookies.house_images[0] ? req.cookies.house_images[0].path : "https://i.ibb.co/FxhPxzF/a5.png",
            isRented: false,
            address: req.cookies.house_address,
            validByAdmin: true,
            Visittime: 0,
            validByAdmin: false

        });
        newProduct.save();
        res.cookie(cookieValue.USER_ROLE, ROLE.HOST);
        res.clearCookie(cookieValue.HOUSE_NAME);
        res.clearCookie(cookieValue.HOUSE_AVAILABLE_FROM);
        res.clearCookie(cookieValue.HOUSE_AVAILABLE_TO);
        res.clearCookie(cookieValue.HOUSE_IMAGES);
        res.clearCookie(cookiesValue.HOUSE_CATEGORY);
        res.clearCookie(cookiesValue.HOUSE_AVAILABLE_BED);
        res.clearCookie(cookieValue.HOUSE_AVAILABLE_SHOWER);
        res.clearCookie(cookieValue.HOUSE_ADDRESS);
        res.clearCookie("display");
        res.clearCookie(cookieValue.HOUSE_ADDRESS);
        res.clearCookie(cookieValue.HOUSE_IMAGES);



        res.redirect("/");
    }

}
module.exports = new RoomController();
