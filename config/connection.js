const {Sequelize} = require('sequelize');

const sequelize = new Sequelize('library', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = sequelize;
