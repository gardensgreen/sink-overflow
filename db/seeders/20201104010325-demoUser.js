"use strict";
const bcrypt = require("bcryptjs");
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert(
            "Users",
            [
              {
                username: 'Demo',
                email: "demo@demo.com",
                hashedPassword: "$2a$10$rp2T6gN3emCXuX4ezYju0u/5OvaROYtuNdmcvyD.IUstE48TP0xwu",
                createdAt: new Date(),
                updatedAt: new Date(),
              }
            ],
            {}
        );
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete("Users", null, {});
    },
};
