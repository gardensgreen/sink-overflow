"use strict";
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable("Votes", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            isDownvote: {
                allowNull: false,
                type: Sequelize.BOOLEAN,
            },
            userId: {
                allowNull: false,
                type: Sequelize.INTEGER,
                references: { model: "Users" },
            },
            answerId: {
                type: Sequelize.INTEGER,
                references: { model: "Answers" },
            },
            questionId: {
                type: Sequelize.INTEGER,
                references: { model: "Questions" },
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable("Votes");
    },
};
