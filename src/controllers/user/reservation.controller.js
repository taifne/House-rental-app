const ReservationModel = require("../../models/reservation.model");
const HouseModel = require("../../models/host.model");
const VIEW = require("../../constants/viewName");
const paypal = require("paypal-rest-sdk");

class ReservationController {
  async getUserReservation(req, res, next) {
    try {
      let logged = req.cookies.token ? true : false;
      let user_name = req.cookies.username;
      let user_email = req.cookies.email;
      let user_phone = req.cookies.phone;
      let user_avatar = req.cookies.avatar;
      let user_reservation_list = await ReservationModel.find({ cus: req.cookies.id }).populate(["room", "host"]).lean();
      let fre_checking_house_list = user_reservation_list.filter((item) => item.start.getTime() > Date.now());
      let checking_house_list = user_reservation_list.filter((item) => item.start.getTime() < Date.now() && item.end.getTime() > Date.now());
      let checked_house_list = user_reservation_list.filter((item) => item.end.getTime() < Date.now());
      res.render(VIEW.USER_RESERVATION_PAGE, {
        fre_checking_house_list,
        checking_house_list,
        checked_house_list,
        user_name,
        user_email,
        user_phone,
        user_avatar,
        user_reservation_list,
        islogged: logged,
        hideNavigation: true
      });
    } catch (error) {
      next(error);
    }
  }

  payment(req, res, next) {

    const value = req.body.final;
    res.cookie("value", value, {
      secure: true,
      httpOnly: true,
    });
    const create_payment_json = {
      "intent": "sale",
      "payer": {
        "payment_method": "paypal"
      },
      "redirect_urls": {
        "return_url": "http://localhost:3000/reservation/payment/success",
        "cancel_url": "http://localhost:3000"
      },
      "transactions": [{
        "item_list": {
          "items": [{
            "name": "item",
            "sku": "item",
            "price": value,
            "currency": "USD",
            "quantity": 1
          }]
        },
        "amount": {
          "currency": "USD",
          "total": value
        },
        "description": "This is the payment description."
      }]
    };


    const newReserve = new reservationModel({
      host: req.body.hostId,
      room: req.body.roomId,
      start: req.body.startday,
      end: req.body.endday,
      day: req.body.days,
      value: req.body.final,
      cus: req.cookies.user_id

    });

    const datesInRange = [];
    const currentDate = new Date(req.body.startday);
    const endDate = new Date(req.body.endday);

    while (currentDate <= endDate) {
      datesInRange.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    houseModel.findByIdAndUpdate(req.body.roomId, { $push: { DatesRented: { $each: datesInRange } } })
      .then(() => {
        console.log('Items added to the array');
      })
      .catch((error) => {
        console.error('Error adding items to the array:', error);
      });

    newReserve.save();
    paypal.payment.create(create_payment_json, function (error, payment) {
      if (error) {
        throw error;
      } else {
        for (let i = 0; i < payment.links.length; i++) {
          if (payment.links[i].rel === 'approval_url') {
            res.redirect(payment.links[i].href);
          }
        }
      }
    });

  }

  success(req, res, next) {

    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;

    const execute_payment_json = {
      "payer_id": payerId,
      "transactions": [{
        "amount": {
          "currency": "USD",
          "total": req.cookies.value
        }
      }]
    };

    paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
      if (error) {
        console.log(error.response);
        throw error;
      } else {
        console.log(JSON.stringify(payment));
        res.render(VIEW.RESERVATION_SUCCESS_PAGE, { hideNavigation: true });
      }
    });
  }


}
module.exports = new ReservationController();