const AppError = require("../utils/appError")

const sendErrorForDevelopment = (err, res) =>
    res.status(err.statusCode).json({
        status: err.status,
        err,
        message: err.message,
        stack: err.stack,
    });

const globalError = (err, req, res, next) => {

    if (process.env.NODE_ENV !== 'production') {
        if (err instanceof AppError) {
            const errorMessages = JSON.parse(err.message);
            res.status(err.statusCode).json({
                success: false,
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
}

module.exports = globalError;