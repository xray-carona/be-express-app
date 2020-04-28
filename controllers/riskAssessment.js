const axios = require('axios');
const config = require('../config');
const ML_BASE_URL = config.ML_BASE_URL
const NODE_ENV = config.NODE_ENV

const vitalRiskAssessment = ({oxygen} = {}) => {
    // News 2
}

const patientRiskAssessment = ({
                                   age, gender, occupation, address_zone,
                                   travel_history, diabetes, hypertension,
                                   cardiac_disease, immunosupression
                               } = {}) => {
    // Based on Basic questions
    let score = 0
    if (age >= 65) score += 2
    if (gender.toLowerCase() === 'male') score += 1
    // +3
    if (diabetes) score += 3
    if (hypertension) score += 3
    if (cardiac_disease) score += 3
    if (immunosupression) score += 3
    if (travel_history) score += 3
    if (address_zone) score += 3
    // Different scores for different occupation
    if (occupation.toLowerCase() === 'indoor') score += 0
    else if (occupation.toLowerCase() === 'other') score += 1
    else if (occupation.toLowerCase() === 'delivery') score += 2
    else if (occupation.toLowerCase() === 'essential') score += 3 // Healthcare and Police
    // Risk based on score
    if (score >= 6) return {"risk": "HIGH", "score": score}
    else if (score >= 3) return {"risk": "MEDIUM", "score": score}
    else return {"risk": "LOW", "score": score}


}

const symptomsRiskAssessment = ({
                                    fever, dry_cough, shortness_of_breath,
                                    sore_throat, fatigue, body_ache,
                                    loss_of_taste_smell, diahorrea, runny_nose
                                }
                                    = {}) => {
    let score = 0
    //+3
    if (fever) score += 3
    if (dry_cough) score += 3
    if (shortness_of_breath) score += 3
    if (sore_throat) score += 3
    // +2
    if (fatigue) score += 2
    if (body_ache) score += 2
    if (loss_of_taste_smell) score += 2
    if (diahorrea) score += 2
    if (runny_nose) score += 1
    // Risk based on score
    if (score >= 6) return {"risk": "HIGH", "score": score}
    else if (score >= 3) return {"risk": "MEDIUM", "score": score}
    else return {"risk": "LOW", "score": score}

}
const calculateRisk = (req, resp) => {
    console.log('Risk Hit')
    console.log(req.body)
    const patientScore = patientRiskAssessment(req.body)
    const symptomScore = symptomsRiskAssessment(req.body)
    resp.json({"patientScore": patientScore, "symptomScore": symptomScore, "test": true})
}

exports.riskAssessment = (req, res, next) => {
    calculateRisk(req, res);
};