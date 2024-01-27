const houseModel = require("../../models/houseModel");
const reservationModel = require("../../models/reservationModel");
const ratingModel = require("../../models/ratingModel");
const client = require("../../config/redis");
const VIEW = require("../../constants/viewName")
const ROLE = require("../../constants/role")
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






}
module.exports = new HouseController();
