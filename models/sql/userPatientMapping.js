module.exports = (sequelize, DataTypes) => {
    const UserPatientMap = sequelize.define('UserPatientMap', {
        user_id:{type:DataTypes.INTEGER,allowNull:false},
        patient_id:{type:DataTypes.INTEGER,allowNull:false},
        active:{type:DataTypes.BOOLEAN,defaultValue:true} //Lets say patient moves to another doctor

    }, {tableName: 'user_patient_mapping'});
    UserPatientMap.associate = function (models) {
        // associations can be defined here
        UserPatientMap.hasMany(models.Patient,{foreignKey:{name:'patient_id'},sourceKey:'patient_id'})
    };
    return UserPatientMap;
};