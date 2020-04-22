module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        user_id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
        email: {type: DataTypes.STRING, allowNull: false},
        password: {type: DataTypes.STRING, allowNull: false},
        name: {type: DataTypes.STRING},
        role: {type: DataTypes.STRING},
        verified:{type: DataTypes.INTEGER,defaultValue:0} //Can be used to setup email verification
    }, {tableName: 'users'});
    User.associate = function (models) {
        // associations can be defined here
    };
    return User;
};