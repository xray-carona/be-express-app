const registerController = require('../controllers/register');
const loginController = require('../controllers/login');
const dashboardController = require('../controllers/dashboard');
const homeController = require('../controllers/home');
const express = require('express');

let router = express.Router();

router.use('/register', registerController);
router.use('/login', loginController.login);
router.use('/dashboard', dashboardController);
router.use('/', homeController.index);

module.exports = router;