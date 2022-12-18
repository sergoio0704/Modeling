const accountRepository = require('../repositiories/accountRepository')
const authenticator = require('./authenticator')
const jwt = require('jsonwebtoken')
const config = require('config')
const fs = require('fs')

const multer  = require('multer');
const storageConfig = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, config.avatarStoragePath);
    },
    filename: (req, file, cb) => {
        let token = req.query.token;
        if (!token) {
            token = req.body.token;
        }
        jwt.verify(token, config.jwtSecret, (error, account) => {
            if (error) {
                return;
            }
            req.account = account;
        });
        cb(null, `${config.avatarPrefix}${req.account.id}`);
    }
});
const upload = multer({storage: storageConfig});

async function getAccount(req, res) {
    try {
        const accountId = req.account.id
        const account = await accountRepository.getAccountById(accountId);
        if (!account) {
            return res.status(501).json({
                msg: 'internal_error'
            })
        }
        
        const accountRole = await accountRepository.getAccountRoleById(accountId)
        account.role = accountRole.name

        res.status(200).json(account)
    } catch(e) {
        res.status(501)
        res.json({msg: 'internal_error'})
    }
}

async function saveAccount(req, res) {
    try {
        const account = req.body;
        const file_name = `${config.avatarPrefix}${req.account.id}`
        const id_account = req.account.id;
        await accountRepository.saveAccount(account, id_account, file_name)
        res.status(200)
        res.json({msg: 'success'})
    }   
    catch(e) {
        res.status(500);
        res.json({msg: 'internal_error'});
    } 
}

async function getAvatar(req, res) {
    const account_id = req.account.id;
    const file = await accountRepository.getFileByAccountId(account_id)

    if (!file.name) {
        res.status(200);
        res.send(null);
    }

    const path = config.avatarStoragePath + file.name

    if (fs.existsSync(path)) {
        res.sendFile(path);
    } else {
        res.status(200);
        res.send(null);
    }
}


module.exports = function (app) {
    app.get('/api/v1/account', authenticator.apiAuthenticateJWT, getAccount)
    app.post('/api/v1/account/save', [upload.single('avatar'), authenticator.apiAuthenticateJWT], saveAccount);
    app.get('/api/v1/account/avatar', authenticator.apiAuthenticateJWT, getAvatar);
};