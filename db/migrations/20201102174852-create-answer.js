"use strict";
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable("Answers", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            content: {
                allowNull: false,
                type: Sequelize.TEXT,
            },
            userId: {
                allowNull: false,
                type: Sequelize.INTEGER,
                references: { model: "Users" },
            },
            questionId: {
                allowNull: false,
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
        await queryInterface.dropTable("Answers");
    },
};
