const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')

const accountRepository = require('../repositiories/accountRepository')
const authValidator = require('../services/authValidator')

async function register(req, res) {
    const data = req.body
    const validationResult = authValidator.registerValidation(data)
    console.log(validationResult)
    if (!validationResult.isValid) {
        return res.status(400).json({
            errors: validationResult.errors,
            msg: 'Некорректные данные!'})
    }

    try {
        const isEmailExists = await accountRepository.checkEmailUnique(data.email)
        if (isEmailExists) {
            return res.status(400).json({msg: 'email_exists'})
        }
        
        data.password = await bcrypt.hash(data.password, 12)
        await accountRepository.register(data)
        res.status(200)
        res.json({msg: 'success'})
    } catch (e) {
        res.status(501)
        res.json({msg: 'internal_error'})
    }
}

async function login(req, res) {
    const data = req.body
    const validationResult = authValidator.loginValidation(data)
    if (!validationResult.isValid) {
        return res.status(400).json({
            errors: validationResult.errors,
            msg: 'Некорректные данные!'})
    }

    try {
        const account = await accountRepository.getAccountByEmail(data.email)
        console.log(account, data)
        if (!account) {
            return res.status(400).json({msg: 'Некорректные данные!'})
        }
        const isMatch = await bcrypt.compare(data.password, account.pass)
        if (isMatch) {
            const token = jwt.sign({id: account.id_account,email: account.email}, config.jwtSecret);
            res.status(200);
            res.json({token: token})
        } else {
            res.status(401);
            res.json({msg: 'unauthorized'})
        }
    } catch (e) {
        console.log(e.message)
        res.status(501)
        res.json({msg: 'internal_error'})
    }
}





module.exports = function (app) {
    app.post('/api/v1/register', register)
    app.post('/api/v1/login', login)
};