"use strict";

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert(
            "Votes",
            [
                {
                    isDownvote: false,
                    questionId: 2,
                    answerId: null,
                    userId: 1,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    isDownvote: false,
                    questionId: 1,
                    answerId: null,
                    userId: 2,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    isDownvote: true,
                    questionId: null,
                    answerId: 2,
                    userId: 1,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    isDownvote: false,
                    questionId: null,
                    answerId: 1,
                    userId: 2,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ],
            {}
        );
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete("Votes", null, {});
    },
};
