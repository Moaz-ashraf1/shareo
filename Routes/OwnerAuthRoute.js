const express = require('express');
const router = express.Router();

const { signup, login, checkDataBeforeSignup, protect, changePassword } = require("../Controllers/OwnerAuthController")
const { ownerSignupVaildator, ownerLoginValidator, changePasswordValidator } = require("../utils/vaildators/BusinessOwnerVaildator")

router.route('/signup').post(ownerSignupVaildator, signup)
router.route('/login').post(ownerLoginValidator, login)
router.route('/checkDataBeforeSignup').post(checkDataBeforeSignup)
router.route("/changePassword").post(changePasswordValidator, changePassword)

module.exports = router;