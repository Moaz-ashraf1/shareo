const asyncHandler = require('express-async-handler')
const ProjectType = require("../Models/ProjectTypeModel");

exports.createProjectTypes = asyncHandler(async (req, res, next) => {
    const projectTypesData = [
        {
            ar: "النوع الاول",
            en: "Type one"
        },
        {
            ar: "النوع الثاني",
            en: "Type two"
        },
        {
            ar: "النوع الثالث",
            en: "Type three"
        }
    ];

    try {
        const projects = await ProjectType.bulkCreate(projectTypesData);

        res.status(200).json({
            projects
        });
    } catch (error) {
        console.error('Error inserting records:', error);
        res.status(500).json({
            error: 'An error occurred while creating project types.'
        });
    }
});
