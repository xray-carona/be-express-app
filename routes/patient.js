const express = require('express');
const router = express.Router();

const patientController = require('../controllers/patient');

router.post('',patientController.getPatientProfile);

module.exports=router;