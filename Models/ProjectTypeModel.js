
const { DataTypes } = require('sequelize');
const sequelize = require('../Sequelize/config');

const Owner = require("../Models/BusinessOwnerModel")

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

})

ProjectType.hasMany(Owner, { as: "owner", foreignKey: 'projectType' });


(async () => {
    try {
        await ProjectType.sync({
            force: false,
        });
    } catch (error) {
        console.error('Error syncing model:', error);
    }
})();

module.exports = ProjectType;