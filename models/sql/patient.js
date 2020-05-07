module.exports = (sequelize, DataTypes) => {
    const Patient = sequelize.define('Patient', {
        patient_id:{type:DataTypes.INTEGER,primaryKey:true,autoIncrement:true},
        // user_id: {type: DataTypes.INTEGER, }, // Multiple users... move to different table
        hospital_patient_id:{type:DataTypes.INTEGER},
        first_name:{type:DataTypes.STRING},
        last_name:{type:DataTypes.STRING},
        age:{type:DataTypes.INTEGER},
        gender:{type:DataTypes.STRING},
        discharge_date:{type:DataTypes.DATE},
        active:{type:DataTypes.BOOLEAN,defaultValue:true}, //Active , Inactive Patient
        extra:{type:DataTypes.JSONB}

    }, {tableName: 'patients'});
    Patient.associate = function (models) {
        // associations can be defined here
    };
    return Patient;
};