const axios = require('axios');
const config = require('../config');
const NODE_ENV = config.NODE_ENV

Number.prototype.between = function (a, b, inclusive) {
    const min = Math.min(a, b),
        max = Math.max(a, b);

    return inclusive ? this >= min && this <= max : this > min && this < max;
}
const vitalRiskAssessment = ({
                                 respiration_rate, spo2_scale1, spo2_scale2, oxygen,
                                 systolic_bp, pulse, consciousness, temperature
                             } = {}) => {
    // News  scoring system
    let score = 0
    let redScore = false // Any parameter with score 3
    if (oxygen) score += 2
    if (consciousness==false) {score += 3 , redScore = true }//CVPU , person not alert

    if (respiration_rate!=null){
        if (respiration_rate <= 8 || respiration_rate >= 25) {score += 3 ,redScore=true}// respiration rate per minute
        else if (respiration_rate.between(21, 24, true)) score += 2
        else if (respiration_rate.between(9, 11, true)) score += 1
    }

    if (pulse!=null){
        if (pulse <= 40 || pulse >= 131) {score += 3 , redScore=true}
        else if (pulse.between(111, 130, true)) score += 2
        else if (pulse.between(41, 50, true) || pulse.between(91, 110)) score += 1

    }

    if (systolic_bp!=null){
        if (systolic_bp <= 90 || systolic_bp >= 220) score += 3 ,redScore=true
        else if (systolic_bp.between(91, 100, true)) score += 2
        else if (systolic_bp.between(101, 110, true)) score += 1
    }

    if (temperature!=null){
        if (temperature <= 35.0) {score += 3 , redScore=true}
        else if (temperature >= 39.1) score += 2
        else if (temperature.between(35.1, 36.0, true) || temperature.between(38.1, 39.0, true)) score += 1
    }

    if (spo2_scale1!=null){
        if (spo2_scale1 <= 91) {score += 3 , redScore=true}
        else if (spo2_scale1.between(92, 93, true)) score += 2
        else if (spo2_scale1.between(94, 95, true)) score += 1
    }

    if (spo2_scale2!=null){
        if (spo2_scale2 <= 83 || (spo2_scale1 >= 97 && oxygen)) {score += 3 , redScore=true}
        else if (spo2_scale2.between(84, 85, true) || (spo2_scale2.between(95, 96, true) && oxygen)) score += 2
        else if (spo2_scale2.between(86, 87, true) || (spo2_scale2.between(93, 94, true) && oxygen)) score += 1
    }


    // News threshold and triggers
    if(score.between(0,4,true) && !redScore) return {"score":score,"risk":"LOW","response":"Ward-based response"}
    else if(score.between(5,6,true)) return {"score":score,"risk":"MEDIUM","response":"Key threshold for urgent response"}
    else if (score>=7) return {"score":score,"risk":"HIGH","response":"Urgent or emergency response"}
    else if (redScore) return {"score":score,"risk":"LOW-MEDIUM","response":"Urgent Ward-Based response"}

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
    if (occupation!=null){
        if (occupation.toLowerCase() === 'indoor') score += 0
        else if (occupation.toLowerCase() === 'other') score += 1
        else if (occupation.toLowerCase() === 'delivery') score += 2
        else if (occupation.toLowerCase() === 'essential') score += 3
    } // Healthcare and Police}

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
    const vitalScore = vitalRiskAssessment(req.body)
    resp.json({"patientScore": patientScore, "symptomScore": symptomScore, "vitalScore":vitalScore, "test": true})
}

exports.riskAssessment = (req, res, next) => {
    calculateRisk(req, res);
};