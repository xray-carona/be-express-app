const axios = require('axios');
const config = require('../config');
const ML_BASE_URL = config.ML_BASE_URL
const NODE_ENV = config.NODE_ENV

const calculateRisk=(req,resp)=>{
    console.log('Risk Hit')
    console.log(req.body)
    resp.json(req.body)
}

exports.riskAssessment = (req,res,next)=>{
    calculateRisk(req,res);
};