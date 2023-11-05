const express = require('express');
const morgan = require('morgan');
require('dotenv').config({
    path: '.env',
});

const sequelize = require('./Sequelize/config');
const ApiError = require('./utils/apiError')
const globalError = require("./Middleware/globalErrorHandling ")
const authRouter = require('./Routes/OwnerAuthRoute')
const projectTypeRouter = require('./Routes/ProjectTypesRoute')
const { connectToDatabase } = require('./db/connectToDB')
const association = require("./db/Associations")

const app = express();

// connect to db 
connectToDatabase();

app.use(express.json());
app.use(morgan('dev'));

// mount routes
app.use('/api/v1/businesOwner/', authRouter)
app.use('/api/v1/projectType/', projectTypeRouter)

// Handle unmatched routes
app.all("*", (req, res, next) => {
    return next(new ApiError(
        JSON.stringify({
            ar: `لا يمكن العثور على هذا المسار: ${req.originalUrl}`,

            en: `can't find this route:${req.originalUrl}`
        })


        , 400));
});

// Global error handling middleware for express
app.use(globalError);


const PORT = process.env.PORT || 3000;
sequelize.sync()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Error syncing database:', error);

    });



