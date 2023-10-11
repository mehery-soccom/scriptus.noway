const config = require('@bootloader/config');
const express = require('express');
const router = express.Router();

const noway_controller = require('../app/controller/noway_controller');
router.use('/noway/',noway_controller);

const sample_controller = require('../app/controller/sample_controller');
router.use('/sample/',sample_controller);

module.exports = router;