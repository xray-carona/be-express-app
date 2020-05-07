const db = require('../models/sql')
const UserPatientMap = db.UserPatientMap;

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
    UserPatientMap.findAll({where:{
        [Op.and]:[
            {user_id:user_id},
            {active:active}] //Getting only active patients
        }
        ,attributes:['patient_id']}).then(patients=>{
        if (patients.length){
            return {"success":true,"data":patients,"message":`${patients.length} patients found for user`}

        }else{
            return {"success":"false","data":null,"message":"No Patient found for given user"}
        }
    })
}
module.exports={
    createUserPatientMap:createUserPatientMap,
    updateUserPatientMap:updateUserPatientMap,
    getPatientsFromUser:getPatientsFromUser,
}