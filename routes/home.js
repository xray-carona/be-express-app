const express = require('express');
const homeController = require('../controllers/home');

let router = express.Router();

console.log('home router');
router.get('/', homeController.index);

module.exports = router;