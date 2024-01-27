
const COOKIE_VALUE = require("../../constants/cookieValue")
const VIEW = require("../../constants/viewName")
class LogoutController {
    index(req, res, next) {
        res.clearCookie(COOKIE_VALUE.TOKEN);
        res.clearCookie(COOKIE_VALUE.USER_ID);
        res.clearCookie(COOKIE_VALUE.USER_ADDRESS);
        res.clearCookie(COOKIE_VALUE.USER_AVATAR);
        res.clearCookie(COOKIE_VALUE.USER_EMAIL);
        res.clearCookie(COOKIE_VALUE.USER_EVALUE_COUNT);
        res.clearCookie(COOKIE_VALUE.USER_FULLNAME);
        res.clearCookie(COOKIE_VALUE.USER_NAME);
        res.clearCookie(COOKIE_VALUE.USER_NAME);
        res.clearCookie(COOKIE_VALUE.USER_PHONE_NUMBER);
        res.render(VIEW.LOGIN_PAGE, { user: {}, hideNavigation: true });
    }
}
module.exports = new LogoutController();
