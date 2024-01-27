const userModel = require("../../models/userModel");
const { verifyEmail, sendPassword } = require("../../config/nodemail");
var generator = require('generate-password');
const bcrypt = require("bcrypt");
const VIEW = require("../../constants/viewName")
const APP_MESSAGE = require("../../constants/appConstants");
const COOKIE_VALUE = require("../../constants/cookieValue")
class AccountControler {
    async sendVerifyEmail(req, res, next) {
        try {
            const url = `${process.env.BASE_URL}/account/validemail/${req.params.id}`;
            await verifyEmail(req.cookies.user_email, "Verify Email", url);
            next();
        } catch (error) {
            console.log(error);
            res.status(500).send({ message: "Internal Server Error" });
        }
    }
    validEmail(req, res, next) {

        res.render(VIEW.EMAIL_VERIFY_PAGE, { hideNavigation: true, user_id: req.params.id });
    }
    validateEmail(req, res, next) {
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
        res.render(VIEW.EMAIL_VERIFY_SUCCESS_PAGE, { hideNavigation: true });
    }
    activateAccount(req, res, next) {
        userModel.findById(req.params.id).then(item => {
            item.autherized = true;
            item.save();
            res.redirect("/login");
        }).catch(err => { console.log(err); });
    }

    getPassword(req, res, next) {
        res.render(VIEW.FORGET_PASSWORD_PAGE, { hideNavigation: true });
    }
    async sendPassword(req, res, next) {

        const user = await userModel.find({ email: req.body.email }).lean();
        if (Object.entries(user).length === 0) {
            res.render(VIEW.FORGET_PASSWORD_PAGE, {
                message: APP_MESSAGE.ACCOUNT_EMAIL_UNREGISTERED,
                hideNavigation: true,
            });
        } else {
            var password = generator.generate({
                length: 10,
                numbers: true
            });
            let hash = await bcrypt.hash(password, 10);
            await userModel.findOneAndUpdate({ email: req.body.email }, { password: hash });
            const url = "Your new password is " + password;
            sendPassword(req.body.email, "Verify Email", url).then((item) => {
                res.render(VIEW.FORGET_PASSWORD_PAGE, {
                    message: "mật khẩu mới được gửi tơi " + req.body.email,
                    announce: true,
                    hideNavigation: true,
                });
            }).catch(err => console.lof(err));

        }
    }


    async updatePersonalName(req, res, next) {

        let name = req.body.firstname + req.body.lastname;

        await userModel.findOne({ _id: req.cookies.user_id }).then((user) => {
            user.fullName = name;
            user.save();
        }).catch(err => console.log(err));
        res.cookie(COOKIE_VALUE.USER_FULLNAME, name, {
            secure: true,
            httpOnly: true,
        });
        res.redirect("/");
    }
    async updatePersonalPhone(req, res, next) {

        await userModel.findOne({ _id: req.cookies.user_id }).then((user) => {
            user.phoneNumber = req.body.phone;
            user.save()
        }).catch(err => console.log(err));
        res.cookie(COOKIE_VALUE.USER_PHONE_NUMBER, req.body.phone, {
            secure: true,
            httpOnly: true,
        });
        ; res.redirect("/");
    }
    async updatePersonalAddress(req, res, next) {

        await userModel.findOne({ _id: req.cookfies.id }).then((user) => {
            user.address = req.body.address;
            user.save();
        }).catch(err => console.log(err));
        res.cookie(COOKIE_VALUE.USER_ADDRESS, req.body.address, {
            secure: true,
            httpOnly: true,
        });
        res.redirect("/");
    }

}
module.exports = new AccountControler();