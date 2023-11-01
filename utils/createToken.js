const JWT = require('jsonwebtoken')

exports.createToken = async (paylod) => {
    const token = await JWT.sign({ id: paylod }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRES_TIME,
    })
    return token;
}