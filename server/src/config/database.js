const Sequelize = require("sequelize");

const sequelize = new Sequelize("nss", "nss-swe", "nss-pass", {
  dialect: "sqlite",
  storage: "./database.sqlite",
  logging: false,
});

module.exports = sequelize;