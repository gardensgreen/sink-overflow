"use strict";
module.exports = (sequelize, DataTypes) => {
    const Answer = sequelize.define(
        "Answer",
        {
            content: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            questionId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {}
    );
    Answer.associate = function (models) {
        Answer.belongsTo(models.Question, { foreignKey: "questionId" });
        Answer.belongsTo(models.User, { foreignKey: "userId" });
        Answer.hasMany(models.Vote, { foreignKey: "answerId", onDelete: 'cascade', hooks: true });
        Answer.hasMany(models.Comment, { foreignKey: "answerId", onDelete: 'cascade', hooks:true });
    };
    return Answer;
};
