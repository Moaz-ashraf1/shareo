const express = require('express');
const router = express.Router();

const { signup, login } = require("../Controllers/OwnerAuthController")
const { ownerSignupVaildator, ownerLoginValidator } = require("../utils/vaildators/BusinessOwnerVaildator")

router.route('/signup').post(ownerSignupVaildator, signup)
router.route('/login').post(ownerLoginValidator, login)

module.exports = router;