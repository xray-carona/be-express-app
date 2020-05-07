module.exports = (sequelize, DataTypes) => {
    const Organization = sequelize.define('Organization', {
        org_id:{type:DataTypes.INTEGER,primaryKey:true,autoIncrement:true},
        // user_id: {type: DataTypes.INTEGER, }, // Multiple users... move to different table
        name:{type:DataTypes.STRING,unique:true},
        extra:{type:DataTypes.JSONB},
        enabled:{type:DataTypes.BOOLEAN,defaultValue:true}

    }, {tableName: 'organizations'});
    Organization.associate = function (models) {
        // associations can be defined here
    };
    return Organization;
};