const express= require('express');
const router = express.Router();

const userPatientMappingController = require('../controllers/userPatientMapping');

router.post('',userPatientMappingController.getAllPatients)

module.exports=router;