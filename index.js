const express = require('express')
const path = require('path')
const http = require('http')
const bodyParser = require('body-parser');
const cors = require('cors')
require('dotenv').config()
const server = express()
const passport = require('passport');
const cookieParser = require('cookie-parser'); 
// const mongoose = require('mongoose');

const port = process.env.PORT
const imageUploadRoute = require('./routes/upload')
const getMLResponseRoute = require('./routes/getMLResponse')
const login = require('./routes/login')
const register = require('./routes/register')
const riskAssesmentRoute = require('./routes/riskAssessment')
const fileUpload = require('express-fileupload')
const db=require('./config/db');
const models = require('./models/sql')
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(fileUpload())
server.use(cors())
server.use(express.static(path.join(__dirname, '../client/public')))
server.use(passport.initialize());
server.use(cookieParser());
// mongoose.connect('mongodb://127.0.0.1:27017/auth', {
//       useNewUrlParser: true,
//       useCreateIndex: true
//     });

server.use('/api/v1/upload', imageUploadRoute)
server.use('/api/v1/getMLResponse', getMLResponseRoute)
server.use('/api/v1/login', login)
server.use('/api/v1/register', register)
server.use('/api/v1/riskAssessment',riskAssesmentRoute)
server.use('/test',function (req,res) {
    res.json({"result":"Test","current_time":new Date(),"dep":"auto"})
})
// db.authenticate().then(
//     ()=>console.log('Database connected.')
// ).catch(err=>console.log('Database Error:'+err))
models.sequelize.sync().then(() => {
    console.log('Drop and Resync with {force: true}');
});
http.createServer(server).listen(port, () => {
    console.log(`Express server listening on port ${port}`);
})