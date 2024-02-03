const houseModel = require("../../models/houseModel");
const reservationModel = require("../../models/reservationModel");
const ratingModel = require("../../models/ratingModel");
const client = require("../../config/redis");
const VIEW = require("../../constants/viewName")
const ROLE = require("../../constants/role")
const houseCategoryModel = require("../../models/houseCategoryModel");
const userModel = require("../../models/userModel");
const cookieValue = require("../../constants/cookieValue");

class HouseController {


  addComment(req, res, next) {
    ratingModel.findOne({ owner: req.cookies.id, room: req.body.room }).then((item) => {
      if (item) {
        item.value = req.body.value,
          item.star = req.body.rating
        item.save();
      } else {
        let newComment = new ratingModel({
          owner: req.cookies.id,
          value: req.body.value,
          star: req.body.rating,
          room: req.body.room,
          host: req.body.host
        })
        newComment.save();
      }
      res.redirect("/user/trip");
    }).catch(err => { console.log(err); })
  }
  async specific(req, res, next) {
    let logged;
    if (req.cookies.token) {
      logged = true;
    }
    else {
      logged = false;
    }
    let isAdmin = false;
    if (req.cookies.user_role) {
      isAdmin = req.cookies.user_role === ROLE.ADMIN ? true : false;
    }
    else { isAdmin = false; }
    let user_name = req.cookies.user_name;
    let user_email = req.cookies.user_email;
    let user_phone = req.cookies.user_phone;
    let user_avatar = req.cookies.user_avatar;
    let user_address = req.cookies.user_address;
    let user_id = req.cookies.user_id;

    let conversationId = req.cookies.conversationId;
    let item = await reservationModel.find({ value: "9.2" });
    let key = "room" + req.params.id;
    client.hGetAll(key, async (error, value) => {
      if (error || value === null) {

        let house_detail = await houseModel.findOne({ _id: req.params.id }).populate('host');
        house_detail.Visittime = house_detail.Visittime + 1;
        house_detail.save();
        house_detail = house_detail.toObject();
        await client.hSet(key, 'data', JSON.stringify(house_detail));
        let isOwner = (req.cookies.user_id === house_detail.host._id)
          ? true : false;
        let house_rating_list = await ratingModel.find({ room: req.params.id }).populate("owner").lean();
        await client.hSet(key, 'rating', JSON.stringify(house_rating_list));
        client.expire(key, 600);
        house_detail = JSON.stringify(house_detail);
        house_detail = JSON.parse(house_detail);

        res.render(VIEW.HOUSE_DETAIL_PAGE, {
          user_role: req.cookies.user_role,
          user_address,
          isOwner,
          user_id,
          user_name,
          user_email,
          user_phone,
          user_avatar,
          islogged: logged,
          house_detail,
          admin: isAdmin,
          house_rating_list
        });

      }
      else {

        let house_detail = JSON.parse(value.data);
        let house_rating_list = JSON.parse(value.rating);

        res.render(VIEW.HOUSE_DETAIL_PAGE, {
          user_role: req.cookies.user_role,
          user_address,
          isOwner,
          user_id,
          user_name,
          user_email,
          user_phone,
          user_avatar,
          islogged: logged,
          house_detail,
          admin: isAdmin,
          house_rating_list
        });

      }
    });


  }


  //GET /host/room
  async Index(req, res, next) {

    let user_id = req.cookies.user_id;
    const user_house_list = await houseModel.find({ host: user_id }).lean();

    res.render(VIEW.ADD_HOUSE_GUIDE_PAGE, {
      hideNavigation: true,
      user_house_list
    });
  }
  async GerHouseDetails(req, res, next) {
    let user_id = req.cookies.user_id;
    const user_house_list = await houseModel.find({ host: user_id }).projection({ name: 1 }).lean();
    const user_house = await houseModel.find({ _id: req.params.id }).lean();
    res.render(VIEW.ADD_HOUSE_GUIDE_PAGE, {
      hideNavigation: true,
      user_house_list,
      user_house
    });
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
module.exports = new HouseController();
