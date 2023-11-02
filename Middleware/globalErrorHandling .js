const ApiError = require("../utils/apiError")

const sendErrorForDevelopment = (err, res) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error'

    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack,
    });
}


const globalError = (err, req, res, next) => {


    if (err instanceof ApiError) {
        const errorMessages = JSON.parse(err.message);
        res.status(err.statusCode).json({
            success: err.status,
            data: {
                en: errorMessages.en,
                ar: errorMessages.ar
            }
        })
    }

    else if (err.name === 'SequelizeValidationError') {

        console.log(err);
        const errorMessages = err.errors.map((error) => {
            const message = JSON.parse(error.message);
            return {
                ar: message.ar,
                en: message.en,
            };
        });

        res.status(400).json({
            success: false,
            data: errorMessages,
        });
    }
    else {
        sendErrorForDevelopment(err, res)
    }

}

module.exports = globalError;