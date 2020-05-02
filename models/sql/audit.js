module.exports = (sequelize, DataTypes) => {
    const Audit = sequelize.define('Audit', {
        user_id: {type: DataTypes.INTEGER, },
        user_email:{type:DataTypes.STRING,},
        activity_type:{type: DataTypes.STRING,allowNull:false},
        extra:{type:DataTypes.JSONB}
    }, {tableName: 'audit_dump'});
    Audit.associate = function (models) {
        // associations can be defined here
    };
    return Audit;
};