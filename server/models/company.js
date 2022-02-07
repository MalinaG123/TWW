const sequelize = require('../sequelize');
const { DataTypes } = require('sequelize');

const Company = sequelize.define('company', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        validate: {
            len: [3, 200]
        },
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false
    },

    });

module.exports = Company;