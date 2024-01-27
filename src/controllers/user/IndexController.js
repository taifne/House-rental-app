const houseModel = require("../../models/houseModel");
const houseCategoryModel = require("../../models/houseCategoryModel");
const wishlistModel = require("../../models/wishlistModel");
const client = require("../../config/redis");
const ROLE = require("../../constants/role")
const VIEW = require("../../constants/viewName");
class Home {
    async defaultDisplay(req, res, next) {
        const filter = {};
        const sort = {};
        let user_name = req.cookies.user_name;
        let user_email = req.cookies.user_email;
        let user_phone = req.cookies.user_phone;
        let user_avatar = req.cookies.user_avatar;
        let user_address = req.cookies.user_address;
        let user_role = req.cookies.user_role;
        let user_id = req.cookies.user_id;
        filter.startday = (req.query.start) ? { $lte: req.query.start } : { $lte: "2024-07-7" };
        filter.endday = (req.query.end) ? { $gte: req.query.end } : { $gte: "2022-07-7" };
        filter.maximuncus = (req.query.quantity) ? { $gte: req.query.quantity } : { $gte: 0 };
        filter.bed = (req.query.bedroom) ? { $gte: req.query.bedroom } : { $gte: 0 };
        filter.shower = (req.query.showerroom) ? { $gte: req.query.showerroom } : { $gte: 0 };
        filter.price = (req.query.minPrice) ? { $gte: req.query.minPrice, $lte: req.query.maxPrice } : { $gte: 0 };
        filter.name = (req.query.search) ? { $regex: "^" + req.query.search, $options: "i" } : { $regex: "^(.*?)" }
        filter.host = { $ne: req.cookies.user_id }


        if (req.query.incre || req.query.dec) {
            sort.price = (req.query.incre) ? '-1' : '1';
        }

        if (req.query.newest) {
            sort.created_at = '1'
        }
        sort.name = 1;
        if (req.query.type) {
            filter.type = req.query.type;
        }
        filter.validByAdmin = true;
        let datachart = Array(300).fill(0);
        let isLoggedIn = (req.cookies.token)
            ? true
            : false;
        let isAdmin = (req.cookies.user_role === ROLE.ADMIN && isLoggedIn)
            ? true
            : false;
        let key = JSON.stringify(filter) + JSON.stringify(sort);
        client.hGetAll(key, async (error, value) => {
            if (error || value === null) {
                let house_list = await houseModel.find(filter).sort(sort).populate("host", 'avatar').lean();
                house_list = house_list.map(v => ({ ...v, isLoggedIn: isLoggedIn }))
                const sorted_house_list = Object.fromEntries(
                    Object.entries(house_list).sort((a, b) => Math.random() - 0.5)
                );
                house_list.forEach((item) => { datachart[item.price]++ })
                let price_label_list = datachart.map((val, index) => index);
                let price_value_list = datachart.map((val, index) => val);
                let house_category_list = await houseCategoryModel.find({}).lean();
                let wishlist = await wishlistModel.find({ user: req.cookies.user_id }).lean()

                await client.hSet(key, 'price_label_list', JSON.stringify(price_label_list));
                await client.hSet(key, 'price_value_list', JSON.stringify(price_value_list));
                await client.hSet(key, 'sorted_house_list', JSON.stringify(sorted_house_list));
                await client.hSet(key, 'house_category_list', JSON.stringify(house_category_list));
                await client.hSet(key, 'wishlist', JSON.stringify(wishlist));
                client.expire(key, 600);
                res.render(VIEW.INDEX_PAGE, {
                    price_label_list,
                    price_value_list,
                    user_address,
                    user_name,
                    user_email,
                    user_phone,
                    user_avatar,
                    sorted_house_list,
                    islogged: isLoggedIn,
                    house_category_list,
                    wish: wishlist,
                    user_role,
                    user_id,
                    isAdmin: isAdmin,

                })
            } else {
                const sorted_house_list = JSON.parse(value.sorted_house_list);
                const house_category_list = JSON.parse(value.house_category_list);
                const wishlist = JSON.parse(value.wishlist);
                const price_value_list = JSON.parse(value.price_value_list);
                const price_label_list = JSON.parse(value.price_label_list);
                res.render(VIEW.INDEX_PAGE, {
                    price_label_list,
                    price_value_list,
                    user_address,
                    user_name,
                    user_email,
                    user_phone,
                    user_avatar,
                    sorted_house_list,
                    islogged: isLoggedIn,
                    house_category_list,
                    wish: wishlist,
                    user_role,
                    user_id,
                    isAdmin: isAdmin,

                })
            }
        });
    }
}

module.exports = new Home();
