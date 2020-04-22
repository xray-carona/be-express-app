const express = require('express');
const newUser = require('../controllers/user')

const httpResponses = {
  onValidationError: {
    success: false,
    message: 'Please enter email and password.'
  },
  onUserSaveError: {
    success: false,
    message: 'That email address already exists.'
  },
  onUserSaveSuccess: {
    success: true,
    message: 'Successfully created new user.'
  }
}

// Register new users
function registerUser(request, response) {
  console.log('Inside register')
  newUser.createUser(request,response)
  console.log('User Created')

}

module.exports = {
  registerUser: registerUser
};