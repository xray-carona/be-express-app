const db = require('../models/sql')
const UserPatientMap = db.UserPatientMap;
// const Patient = db.Patient;

const createUserPatientMap=(user_id,patient_id,active=true)=>{
    const newRecord={user_id,patient_id,active}
    UserPatientMap.create(newRecord)
        .then(resp=>{
            console.log(`New mapping created for user ${user_id} and patient ${patient_id}`)
        }).catch(err=>{
        console.log(`New mapping creation failed for user ${user_id} and patient ${patient_id}`)
    })

}
const updateUserPatientMap=(req)=>{

}
const getPatientsFromUser = (user_id,active=true)=>{
    return UserPatientMap.findAll({where:{
        [db.Sequelize.Op.and]:[
            {user_id:user_id},
            {active:active}] //Getting only active patients
        }
        ,include:[{model:db.Patient,required:true}],
        }).then(patients=>{
        if (patients.length){
            // console.log(patients[0].dataValues,)
            const result=patients.map(patient=>{
                const p=patient.get({plain:true});
                    return p.Patients[0]})
            // console.log(result)
            return {"success":true,"data":result,"message":`${patients.length} patients found for user`}

        }else{
            console.log('Error')
            return {"success":"false","data":null,"message":"No Patient found for given user"}
        }
    })
}
const getAllPatients=(req,res)=>{
    console.log(req.body)
    const {user_id} = req.body
    getPatientsFromUser(user_id).then(
        patientsList=>{
            console.log('Inside patientList')
            res.json(patientsList)
        }
    )
    // console.log(patientsList)

}
module.exports={
    createUserPatientMap:createUserPatientMap,
    updateUserPatientMap:updateUserPatientMap,
    getPatientsFromUser:getPatientsFromUser,
    getAllPatients:getAllPatients,
}