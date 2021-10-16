const Sequelize = require('sequelize');

const sequelize = require('../config/connection');

const book_authors = sequelize.define('book_authors', {
    id: {
        type: Sequelize.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    }
});

module.exports = book_authors;
