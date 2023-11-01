
const ProjectType = require("./Models/ProjectType");
const ProjectTypes = await ProjectType.bulkCreate([
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
]);