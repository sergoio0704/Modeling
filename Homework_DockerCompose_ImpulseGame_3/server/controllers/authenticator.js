const jwt = require('jsonwebtoken')
const config = require('config')


function apiAuthenticateJWT(req, res, next) {
    let token = req.query.token
    if (!token) {
        token = req.body.token
    }
    jwt.verify(token, config.jwtSecret, (error, account) => {
        if (error) {
            res.status(501)
            res.json({msg: "invalid_token"})
            return;
        }
        req.account = account
        next();
    });
}


module.exports = {
    apiAuthenticateJWT
};