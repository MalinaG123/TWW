const sequelize = require('../sequelize');
const { DataTypes } = require('sequelize');

const Founder = sequelize.define('founder', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [5, 200]
        },
    },
    rol: {
        // type: DataTypes.ENUM,
        // allowNull: false,
        // values: ['CEO', 'CTO', 'CFO', 'COO', 'CMO']
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isIn: [['CEO', 'CTO', 'CFO', 'COO', 'CMO']]
        },
    }
});

module.exports = Founder;