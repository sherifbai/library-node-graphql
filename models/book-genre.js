const Sequelize = require("sequelize");

const sequelize = require('../config/connection');

const book_genres = sequelize.define('book_genres', {
    id: {
        type: Sequelize.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    }
});

module.exports = book_genres;
