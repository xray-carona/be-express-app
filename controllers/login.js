const express = require('express');
const loginService = require('../services/login');

let router = express.Router();


// router.post('/', loginService.loginUser);
// loginService.loginUser(req, res);

function login(request, response) {
  loginService.loginUser(request, response);
}

module.exports = {
  login: login
};