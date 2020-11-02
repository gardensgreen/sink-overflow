"use strict";
module.exports = (sequelize, DataTypes) => {
    const Comment = sequelize.define(
        "Comment",
        {
            comment: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },

            answerId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {}
    );
    Comment.associate = function (models) {
        Comment.belongsTo(models.User, { foreignKey: "userId" });
        Comment.belongsTo(models.Answer, { foreignKey: "answerId" });
    };
    return Comment;
};
