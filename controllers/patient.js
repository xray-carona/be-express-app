const db = require("../models/sql")
const Patient = db.Patient;

const createPatient =({first_name,last_name,age,gender,hospital_patient_id},user_id)=>{
    const  newRecord= {first_name,last_name,age,gender,hospital_patient_id}
    Patient.create(newRecord)
        .then(patient=>{
            console.log(`New Patient record created for patient_id ${patient.patient_id}`)
            return patient.patient_id
        })
        .catch(err => {
            console.log(`Patient creation failed for ${user_id}, data: ${newRecord}`)
        })
}

const updatePatient = (req)=>{

}

const getPatientDetails = (patient_id)=>{

}
module.exports={
    createPatient:createPatient,
    updatePatient:updatePatient,
    getPatientDetails:getPatientDetails,
}