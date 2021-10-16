const Sequelize = require('sequelize');

const sequelize = require('../config/connection');

const genres = sequelize.define('genres', {
    id: {
        type: Sequelize.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    }
}, {timestamps: true});

module.exports = genres;
