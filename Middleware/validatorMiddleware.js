const { validationResult } = require("express-validator");


const validatorMiddleware = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {

        const errorMessages = errors.array().map((err) => {
            const message = JSON.parse(err.msg)
            return {
                ar: message.ar,
                en: message.en,
            };

        });

        res.status(400).json({
            success: false,
            data: errorMessages,
        });

    } else {
        next();
    }
};

module.exports = validatorMiddleware;