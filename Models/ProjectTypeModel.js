
const { DataTypes } = require('sequelize');
const sequelize = require('../Sequelize/config');

const ProjectType = sequelize.define('ProjectType', {

    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    ar: {
        allowNull: false,
        type: DataTypes.STRING,
    },

    en: {
        allowNull: false,
        type: DataTypes.STRING,
    },

    createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
    },
    updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
    },

});
(async () => {

    await ProjectType.sync({
        force: false,
    });

})();

module.exports = ProjectType;