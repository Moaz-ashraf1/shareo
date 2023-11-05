const ProjectType = require("../Models/ProjectTypeModel")
const BusinessOwner = require("../Models/BusinessOwnerModel")

ProjectType.hasMany(BusinessOwner, { foreignKey: "ProjectTypeId" });
BusinessOwner.belongsTo(ProjectType)

const sequelize = require('../Sequelize/config'); // Replace with the actual path



// Define a function to print columns for a model
function printColumns(model) {
    console.log(`Columns for ${model.name}:`);
    for (const column in model.rawAttributes) {
        console.log(`- ${column}: ${model.rawAttributes[column].type.key}`);
    }
    console.log();
}

// Print columns for your models
printColumns(ProjectType);
printColumns(BusinessOwner);


