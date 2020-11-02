"use strict";
module.exports = (sequelize, DataTypes) => {
    const Vote = sequelize.define(
        "Vote",
        {
            isDownvote: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
            },

            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            answerId: {
                type: DataTypes.INTEGER,
            },
            questionId: {
                type: DataTypes.INTEGER,
            },
        },
        {}
    );
    Vote.associate = function (models) {
        Vote.belongsTo(models.Answer, { foreignKey: "answerId" });
        Vote.belongsTo(models.Question, { foreignKey: "questionId" });
        Vote.belongsTo(models.User, { foreignKey: "userId" });
    };
    return Vote;
};
