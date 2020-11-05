const { username, password, database, host } = require("./index").db;

module.exports = {
    development: {
        username,
        password,
        database,
        host,
        dialect: "postgres",
        logging: false,
        seederStorage: "sequelize",
    },
    production: {
        use_env_variable: "DATABASE_URL",
        dialect: "postgres",
        logging: false,
        seederStorage: "sequelize",
    },
};
