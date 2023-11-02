const express = require('express');
const router = express.Router();

const { signup, login, checkDataBeforeSignup } = require("../Controllers/OwnerAuthController")
const { ownerSignupVaildator, ownerLoginValidator } = require("../utils/vaildators/BusinessOwnerVaildator")

router.route('/signup').post(ownerSignupVaildator, signup)
router.route('/login').post(ownerLoginValidator, login)
router.route('/checkDataBeforeSignup').post(checkDataBeforeSignup)

module.exports = router;