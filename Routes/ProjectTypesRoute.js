const express = require('express');
const router = express.Router();

const { createProjectTypes } = require("../Controllers/projectTypeController");

router.route('/create').post(createProjectTypes)

module.exports = router;
