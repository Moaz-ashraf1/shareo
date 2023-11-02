const sequelize = require('../Sequelize/config');
exports.connectToDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        throw new Error('Unable to connect to the database');
    }
}