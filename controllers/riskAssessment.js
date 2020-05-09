const axios = require('axios');
const config = require('../config');
const NODE_ENV = config.NODE_ENV
const db = require('../models/sql');
const Risk = db.Risk;
const Patient = require('./patient')
const UserPatientMapping = require('./userPatientMapping')

const newRiskRecord = (user_id,patient_id, patient_info, output) => {
    const newRecord = {user_id, patient_id,patient_info, output}
    Risk.create(newRecord)
        .then(risk => {
            console.log(`New Risk Assessment record created by ${user_id}`)
        })
        .catch(err => {
            console.log(`Record creation failed for ${user_id}, data: ${patient_info},output:${output}`)
        })
}

Number.prototype.between = function (a, b, inclusive) {
    const min = Math.min(a, b),
        max = Math.max(a, b);

    return inclusive ? this >= min && this <= max : this > min && this < max;
}
const vitalRiskAssessment = ({
                                 respirationRate, spo2_scale1, spo2_scale2, isOxygen,
                                 systolicBP, heartRate, isConscious, temperature
                             } = {}) => {
    // News  scoring system TODO use the COVID NEWS2 system
    let score = 0
    let redScore = false // Any parameter with score 3
    heartRate = Number(heartRate)
    respirationRate = Number(respirationRate)
    systolicBP = Number(systolicBP)
    temperature = Number(temperature)
    spo2_scale1 = Number(spo2_scale1)
    spo2_scale2 = Number(spo2_scale2)
    if (isOxygen) score += 2
    if (isConscious == false) {
        score += 3 , redScore = true
    }//CVPU , person not alert

    if (respirationRate != null) {
        if (respirationRate <= 8 || respirationRate >= 25) {
            score += 3 , redScore = true
        }// respiration rate per minute
        else if (respirationRate.between(21, 24, true)) score += 2
        else if (respirationRate.between(9, 11, true)) score += 1
    }

    if (heartRate != null) {
        if (heartRate <= 40 || heartRate >= 131) {
            score += 3 , redScore = true
        } else if (heartRate.between(111, 130, true)) score += 2
        else if (heartRate.between(41, 50, true) || heartRate.between(91, 110)) score += 1

    }

    if (systolicBP != null) {
        if (systolicBP <= 90 || systolicBP >= 220) score += 3 , redScore = true
        else if (systolicBP.between(91, 100, true)) score += 2
        else if (systolicBP.between(101, 110, true)) score += 1
    }

    if (temperature != null) {
        if (temperature <= 35.0) {
            score += 3 , redScore = true
        } else if (temperature >= 39.1) score += 2
        else if (temperature.between(35.1, 36.0, true) || temperature.between(38.1, 39.0, true)) score += 1
    }

    if (spo2_scale1 != null) {
        if (spo2_scale1 <= 91) {
            score += 3 , redScore = true
        } else if (spo2_scale1.between(92, 93, true)) score += 2
        else if (spo2_scale1.between(94, 95, true)) score += 1
    }

    if (spo2_scale2 != null) {
        if (spo2_scale2 <= 83 || (spo2_scale1 >= 97 && oxygen)) {
            score += 3 , redScore = true
        } else if (spo2_scale2.between(84, 85, true) || (spo2_scale2.between(95, 96, true) && oxygen)) score += 2
        else if (spo2_scale2.between(86, 87, true) || (spo2_scale2.between(93, 94, true) && oxygen)) score += 1
    }


    // News threshold and triggers
    if (score.between(0, 4, true) && !redScore) return {
        "score": score,
        "risk": "LOW",
        "response": "Ward-based response"
    }
    else if (score.between(5, 6, true)) return {
        "score": score,
        "risk": "MEDIUM",
        "response": "Key threshold for urgent response"
    }
    else if (score >= 7) return {"score": score, "risk": "HIGH", "response": "Urgent or emergency response"}
    else if (redScore) return {"score": score, "risk": "LOW-MEDIUM", "response": "Urgent Ward-Based response"}

}

const patientRiskAssessment = ({
                                   age, gender, occupation, isAddressZone,
                                   isTravelHistory, isDiabetes, isHypertension,
                                   isCardiacDisease, isImmunosupression
                               } = {}) => {
    // Based on Basic questions
    /* JSON
    {"age":70,"gender":"Male","diabetes":true,"hypertension":true,"cardiac_disease":true,"immunosupression":true,"travel_history":true,"address_zone":true,"occupation":"Essential"}
     */
    age = Number(age)
    let score = 0
    if (age >= 65) score += 2
    if (gender != null && gender.toLowerCase() === 'male') score += 1
    // +3
    if (isDiabetes) score += 3
    if (isHypertension) score += 3
    if (isCardiacDisease) score += 3
    if (isImmunosupression) score += 3
    if (isTravelHistory) score += 3
    if (isAddressZone) score += 3
    // Different scores for different occupation
    if (occupation != null) {
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
                                    isFever, isDryCough, isDifficultyInBreathing,
                                    isSoreThroat, isFatigue, isBodyAche,
                                    isLossOfTasteOrSmell, isDiarrhoea, isRunnyNose
                                }
                                    = {}) => {
    /*
    JSON
    {"fever":true,"dry_cough":true,"shortness_of_breath":true,"sore_throat":true,"fatigue":true,"body_ache":true,"loss_of_taste_smell":true,"diahorrea":true,"runny_nose":true}
    */
    let score = 0

    //+3
    if (isFever) score += 3
    if (isDryCough) score += 3
    if (isDifficultyInBreathing) score += 3
    if (isSoreThroat) score += 3
    // +2
    if (isFatigue) score += 2
    if (isBodyAche) score += 2
    if (isLossOfTasteOrSmell) score += 2
    if (isDiarrhoea) score += 2
    if (isRunnyNose != null && isRunnyNose == 'true') score += 1
    // Risk based on score
    if (score >= 6) return {"risk": "HIGH", "score": score}
    else if (score >= 3) return {"risk": "MEDIUM", "score": score}
    else return {"risk": "LOW", "score": score}

}

const overAllScoreCalculation = (symptomScore, patientScore) => {
    const extra_msg =" Risk of ILI(Influenza Like Disease)" // Move to config?
    if (symptomScore.score > patientScore.score) {
        const newScore={...symptomScore}
        newScore.risk+= extra_msg
        return newScore
    } else {
        const avgScore = (symptomScore.score + patientScore.score) / 2
        if (avgScore >= 6) return {"risk": "HIGH"+extra_msg, "score": avgScore}
        else if (avgScore >= 3) return {"risk": "MEDIUM"+extra_msg, "score": avgScore}
        else return {"risk": "LOW"+extra_msg, "score": avgScore}
    }

}

const hello = (patient_id)=>{
    console.log(patient_id)
}

const calculateRisk = (req, resp) => {
    console.log('Risk Hit')
    console.log(req.body.params.patientInfo)
    const patientInfo = req.body.params.patientInfo.patientInfo
    const user_id = req.body.params.userId
    const patientScore = patientRiskAssessment(patientInfo)
    const symptomScore = symptomsRiskAssessment(patientInfo)
    const vitalScore = vitalRiskAssessment(patientInfo) //if symptom is high, give a overall score, biased on
    const overAllScore = overAllScoreCalculation(symptomScore, patientScore)
    const allScores = {
        "patientScore": patientScore,
        "symptomScore": symptomScore,
        "vitalScore": vitalScore,
        "overAllScore": overAllScore
    }
    Patient.createPatient(patientInfo,user_id).then(
        patientData=>{
            const patient_id=patientData.patient_id
            console.log(patient_id)
            UserPatientMapping.createUserPatientMap(user_id,patient_id) // Might be redundant
            newRiskRecord(user_id,patient_id, patientInfo, allScores)

        }
    )
    // TODO when a patient record is getting updated


    resp.json(allScores)
}

const getPatientHistory=(patient_id)=>{
    return Risk.findAll({where:{patient_id:patient_id},
        order:[
            ['createdAt','DESC'],
        ]}).then(records=>{
            if(records.length){
                return {"success":true,"data":records,"message":`${records.length} records found for patient`}
            }else{
                console.log(`Error fetching records for patient ${patient_id}`);
                return {"success":"false","data":null,"message":"No records found for given patient "}
            }
    })

}

// exports.riskAssessment = (req, res, next) => {
//     calculateRisk(req, res);
// };
module.exports={
    calculateRisk,hello,getPatientHistory}
// exports.calculateRisk=calculateRisk;
// exports.getPatientHistory=getPatientHistory;