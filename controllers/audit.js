const config = require('../config');
const NODE_ENV = config.NODE_ENV
const db = require('../models/sql');
const Audit = db.Audit;

const newAudit=(user_id,user_email,activity_type,extra={})=>{
    const newRecord={user_id,user_email,activity_type,extra}
    Audit.create(newRecord)
        .then(audit=>{
            console.log(`New Audit Record created by ${user_id}`)
        }).catch(err=>{
            console.log(`Error creating Audit record by ${user_id} for activity ${activity_type}`)
    })
}

exports.audit=(req,res,next)=>{
    // console.log(req)
    // console.log(Date.now())
    const activity_type=req.originalUrl
    const user_email=req.body.email||null
    const user_id=req.body.userId ||null
    newAudit(user_id,user_email,activity_type)
    next()
}