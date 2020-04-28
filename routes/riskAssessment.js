const express = require('express');
const router = express.Router();
const riskAssessmentController = require('../controllers/riskAssessment');

router.post('', riskAssessmentController.riskAssessment);

module.exports = router;