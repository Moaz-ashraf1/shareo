const { validationResult } = require("express-validator");


const validatorMiddleware = (req, res, next) => {
    const result = validationResult(req);

    if (!result.isEmpty()) {
        console.log(result);
        const errorMessages = result.errors.map((err) => {
            let message;
            try {
                message = JSON.parse(err.msg);
            } catch (error) {
                message = err.msg;
            }

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