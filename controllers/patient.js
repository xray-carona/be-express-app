const db = require("../models/sql")
const Patient = db.Patient;
const riskAssessment = require('./riskAssessment');

const createPatient =({first_name,last_name,age,gender,hospital_patient_id,extra},user_id)=>{
    const  newRecord= {first_name,last_name,age,gender,hospital_patient_id,extra}
    return Patient.create(newRecord)
        .then(patient=>{
            console.log(`New Patient record created for patient_id ${patient.patient_id}`)
            return patient.get()
        })
        .catch(err => {
            console.log(`Patient creation failed for ${user_id}, data: ${newRecord}`)
        })
}

const updatePatient = (req)=>{

}

const getPatientDetails = (patient_id)=>{

}

const getPatientProfile =(req,res)=>{
    console.log(req.body)
    const {patient_id} = req.body
    // riskAssessment.hello(patient_id)
    riskAssessment.getPatientHistory(patient_id).then(
        records=>{
            console.log('Inside patient history');
            res.json(records);
        }
    )
    // res.json(req.body)
}
module.exports={
    createPatient:createPatient,
    updatePatient:updatePatient,
    getPatientDetails:getPatientDetails,
    getPatientProfile:getPatientProfile,
}