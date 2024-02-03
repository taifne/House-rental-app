
const ratingModel = require("../../models/rate.model");
class RatingController {
  addComment(req, res, next) {
    ratingModel.findOne({ owner: req.cookies.user_id, room: req.body.room }).then((item) => {
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
      res.redirect(`/reservation/${req.cookies.user_id}`);
    }).catch(err => { console.log(err); })
  }
}
module.exports = new RatingController();
