module.exports = (sequelize, DataTypes) => {
    const Risk = sequelize.define('Risk', {
        user_id: {type: DataTypes.INTEGER},
        patient_id:{type:DataTypes.INTEGER},
        patient_info: {type: DataTypes.JSONB},
        output: {type: DataTypes.JSONB},
    }, {tableName: 'risk_assessment_dump'});
    Risk.associate = function (models) {
        // associations can be defined here
    };
    return Risk;
};