const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './sample.db',
    define: {
            timestamps: false
          }
});

module.exports = sequelize;