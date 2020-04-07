const express = require('express');
const apiRoutes = express.Router();

const jwt = require('jsonwebtoken');
const passport = require('passport');
const db = require('../config/db');

const User = require('../models/User');

const httpResponse = {
  onUserNotFound: {
    success: false,
    message: 'User not found.'
  },
  onAuthenticationFail: {
    success: false,
    message: 'Passwords did not match.'
  }
}

function loginUser(request, response) { 
  console.log('in login service');
  let { email, password } = request.body;

  var user = {name:'test',id:'test'};
  // User.findOne({
  //   email: email
  // }, function(error, user) {
  //   if (error) throw error;

  //   if (!user) {
  //     return response.send(httpResponse.onUserNotFound);
  //   }

  //   // Check if password matches
  //   user.comparePassword(password, function(error, isMatch) {
  //     if (isMatch && !error) {
        var token = jwt.sign(user, db.secret, { // user.toJSON()
          expiresIn: 10080
        });

        return response.json({ success: true, token: 'JWT ' + token });
  //     }

  //     response.send(httpResponse.onAuthenticationFail);
  //   });
  // });
};

module.exports = {
  loginUser: loginUser
};