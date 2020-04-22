const express = require('express');
const apiRoutes = express.Router();

const jwt = require('jsonwebtoken');
const passport = require('passport');
const db = require('../config/db');
const config = require('../config');
const User = require('../controllers/user');

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
  // let { email, password } = request.body;
    console.log("Inside Login")
  User.loginUser(request,response)

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
      // var token = jwt.sign(user, db.secret, { // user.toJSON()
      //   expiresIn: 10080
      // });

      // return response.json({ success: true, token: 'JWT ' + token });
  //     }

  //     response.send(httpResponse.onAuthenticationFail);
  //   });
  // });
  //
  //       var users = config.USER_IDS.split(",");
  //       var passwords = config.PASSWORDS.split(",");
  //       for (i = 0; i < users.length; i++) {
  //         if(email === users[i] && password == passwords[i]) {
  //           var user = {name:'test',id:'test'};
  //           var token = jwt.sign(user, db.secret, { // user.toJSON()
  //             expiresIn: 10080
  //           });
  //
  //           return response.json({ success: true, token: 'JWT ' + token });
  //         }
  //       }
  //
  //       response.send(httpResponse.onAuthenticationFail);
};

module.exports = {
  loginUser: loginUser
};