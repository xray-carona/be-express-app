const express = require('express');
const registerService = require('../services/register');

let router = express.Router();

// router.post('/', registerService.registerUser);
//
// module.exports = router;
function register(request,response){
    registerService.registerUser(request,response)
}
module.exports={
    register:register
};