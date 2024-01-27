
const houseModel = require("../../models/houseModel");
const reservationModel = require("../../models/reservationModel");
const VIEW = require("../../constants/viewName")
class HostController {
    //[Get] /user/hosting
    async getHosting(req, res, next) {
        let gonnaCome, isMeeting, hasGone;
        let rooms = await houseModel.find({ host: req.cookies.user_id }).lean();
        let item = await reservationModel.find({ host: req.cookies.user_id }).populate(["room", "cus"]).lean();
        gonnaCome = item.filter((item) => {
            return item.start.getTime() > Date.now()
        })
        isMeeting = item.filter((item) => {
            return (item.start.getTime() < Date.now() && item.end.getTime() > Date.now())
        })
        hasGone = item.filter((item) => {
            return item.end.getTime() < Date.now()
        })
        rooms = rooms.map((e) => {
            let date = new Date(e.startday);

            let year = date.getFullYear();
            let month = String(date.getMonth() + 1).padStart(2, '0');
            let day = String(date.getDate()).padStart(2, '0');

            let start = year + '-' + month + '-' + day;

            let enddate = new Date(e.endday); // Create a new Date object

            let year1 = enddate.getFullYear();
            let month1 = String(enddate.getMonth() + 1).padStart(2, '0');
            let day1 = String(enddate.getDate()).padStart(2, '0');

            let end = year1 + '-' + month1 + '-' + day1;


            return {
                _id: e._id,
                name: e.name,
                title: "da duoc ",
                start: start,
                end: end
            }
        });


        res.render(VIEW.UPCOMMING_RESERVATION_PAGE, { rooms, hideNavigation: true, gonnaCome, isMeeting, hasGone, userId: req.cookies.user_id });
    }

    async getHostingCalendar(req, res, next) {

        const rooms = await houseModel.find({ host: req.cookies.user_id }).lean();
        res.render(VIEW.ONER_HOUSELIST_PAGE, { hideNavigation: true, rooms });
    }
    async getSpecificHostingCalendar(req, res, next) {
        let rooms = await houseModel.find({ _id: req.cookies.user_id }).lean();
        let reser = await reservationModel.find({ room: req.params.id }).populate("cus").lean();
        reser = reser.map((e) => {
            let date = new Date(e.start); // Create a new Date object
            let year = date.getFullYear();
            let month = String(date.getMonth() + 1).padStart(2, '0');
            let day = String(date.getDate() - 1).padStart(2, '0');
            let start = year + '-' + month + '-' + day;
            let enddate = new Date(e.end); // Create a new Date object
            let year1 = enddate.getFullYear();
            let month1 = String(enddate.getMonth() + 1).padStart(2, '0');
            let day1 = String(enddate.getDate()).padStart(2, '0');
            let end = year1 + '-' + month1 + '-' + day1;
            return {
                _id: e._id,
                name: e.name,
                title: "đã được thuê bởi " + e.cus.fullName,
                start: start,
                end: end
            }
        });
        res.render(VIEW.ONER_HOUSEVIEW_PAGE, { reser, rooms });
    }

}
module.exports = new HostController();