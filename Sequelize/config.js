const { Sequelize, Op, Model, DataTypes } = require("sequelize");

const sequelize = new Sequelize(
    process.env.DB_DATABASE,
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD,
    {
        host: "159.89.166.182",
        dialect: process.env.DIALECT,
    }
);

module.exports = sequelize;