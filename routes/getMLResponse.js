const express = require('express');
const router = express.Router();
const getMLResponseController = require('../controllers/getMLResponse');

router.post('', getMLResponseController.getMLResponse)

module.exports = router;