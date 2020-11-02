"use strict";
module.exports = (sequelize, DataTypes) => {
    const Question = sequelize.define(
        "Question",
        {
            title: {
                type: DataTypes.STRING(50),
                allowNull: false,
            },
            content: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {}
    );
    Question.associate = function (models) {
        Question.belongsTo(models.User, { foreignKey: "userId" });
        Question.hasMany(models.Answer, { foreignKey: "questionId" });
        Question.hasMany(models.Vote, { foreignKey: "questionId" });
    };
    return Question;
};
