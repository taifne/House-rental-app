const houseModel = require("../../models/house.model");
const reservationModel = require("../../models/reservation.model");
const VIEW = require("../../constants/viewName");

class HostController {
  async getHosting(req, res, next) {
    const rooms = await houseModel.find({ host: req.cookies.user_id }).lean();
    const items = await reservationModel.find({ host: req.cookies.user_id }).populate(["room", "cus"]).lean();

    const gonnaCome = items.filter(item => item.start.getTime() > Date.now());
    const isMeeting = items.filter(item => item.start.getTime() < Date.now() && item.end.getTime() > Date.now());
    const hasGone = items.filter(item => item.end.getTime() < Date.now());

    const formattedRooms = rooms.map(room => {
      const startDate = new Date(room.startday);
      const endDate = new Date(room.endday);

      return {
        _id: room._id,
        name: room.name,
        title: "da duoc",
        start: formatDate(startDate),
        end: formatDate(endDate)
      };
    });

    res.render(VIEW.UPCOMMING_RESERVATION_PAGE, {
      rooms: formattedRooms,
      hideNavigation: true,
      gonnaCome,
      isMeeting,
      hasGone,
      userId: req.cookies.user_id
    });
  }

  async getHostingCalendar(req, res, next) {
    const rooms = await houseModel.find({ host: req.cookies.user_id }).lean();
    res.render(VIEW.ONER_HOUSELIST_PAGE, { hideNavigation: true, rooms });
  }

  async getSpecificHostingCalendar(req, res, next) {
    const rooms = await houseModel.find({ _id: req.cookies.user_id }).lean();
    const reservations = await reservationModel.find({ room: req.params.id }).populate("cus").lean();

    const formattedReservations = reservations.map(reservation => {
      const startDate = new Date(reservation.start);
      const endDate = new Date(reservation.end);

      return {
        _id: reservation._id,
        name: reservation.name,
        title: `đã được thuê bởi ${reservation.cus.fullName}`,
        start: formatDate(startDate),
        end: formatDate(endDate)
      };
    });

    res.render(VIEW.ONER_HOUSEVIEW_PAGE, { reser: formattedReservations, rooms });
  }
}

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

module.exports = new HostController();
