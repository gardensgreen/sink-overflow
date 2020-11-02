"use strict";
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define(
        "User",
        {
            username: {
                type: DataTypes.STRING(25),
                allowNull: false,
                unique: true,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },

            hashedPassword: {
                type: DataTypes.STRING.BINARY,
                allowNull: false,
            },
        },
        {}
    );
    User.associate = function (models) {
        User.hasMany(model.Question, { foreignKey: "userId" });
        User.hasMany(model.Answer, { foreignKey: "userId" });
        User.hasMany(model.Vote, { foreignKey: "userId" });
        User.hasMany(model.Comment, { foreignKey: "userId" });
    };
    return User;
};
