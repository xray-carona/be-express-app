const {Sequelize}=require('sequelize');
const config=require('./index');
const POSTGRES_HOST= config.POSTGRES_HOST;
const POSTGRES_DB=config.POSTGRES_DB;
const POSTGRES_USER=config.POSTGRES_USER;
const POSTGRES_PASSWORD=config.POSTGRES_PASSWORD;
const db=new Sequelize(POSTGRES_DB,POSTGRES_USER,POSTGRES_PASSWORD,{
    host:POSTGRES_HOST,
    dialect:'postgres',
});
module.exports=db;
//NOT USING THIS!!