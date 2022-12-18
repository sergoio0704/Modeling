const database = require('../db/database')
const { USER } = require("../models/role")

async function checkEmailUnique(email) {
    try {
        const result = await database.db.oneOrNone('SELECT id_account FROM account WHERE email = $1', [email]);
        return !!result;
    } catch (e) {
        console.log("DATABASE checkEmailUnique ERROR: " + e);
    }
    return false;
}

async function register(data) {
    database.db.tx( async t => {
        const account = await t.one(`INSERT INTO account (email, pass, name) VALUES ($1, $2, $3) RETURNING id_account`,
            [data.email, data.password, data.name]);
        const role = await t.one('SELECT * FROM role WHERE name = $1', [USER])
        await t.none('INSERT INTO account_role (id_account, id_role) VALUES ($1, $2)', [account.id_account, role.id_role])
    }).catch( err => {
        console.log("DATABASE register ERROR: " + err)
        throw err
    })
}

async function getAccountByEmail(email) {
    try {
        return await database.db.oneOrNone('SELECT * FROM account WHERE email = $1', [email])
    } catch(e) {
        console.log("DATABASE getAccountByEmail ERROR: " + e)
        throw e
    }

}

async function getAccountById(id) {
    try {
        return await database.db.oneOrNone('SELECT * FROM account WHERE id_account = $1', [id])
    } catch(e) {
        console.log("DATABASE getAccountById ERROR: " + e)
        throw e
    }
}

async function getAccountRoleById(accountId) {
    try {
        return await database.db.one(`
        SELECT r.name FROM role r 
        INNER JOIN account_role ar ON r.id_role = ar.id_role
        WHERE ar.id_account = $1`, [accountId])
    } catch(e) {
        console.log("DATABASE getAccountRoleById ERROR: " + e)
        throw e
    }
}

async function saveAccount(account, id_account, file_name) {
    database.db.tx( async t => {
        const data = await database.db.oneOrNone(`
            INSERT INTO file (name) 
            SELECT $1
            WHERE (SELECT id_avatar FROM account WHERE id_account = $2  ) IS NULL
            RETURNING id_file 
        `, [file_name, id_account])
        
        if (data.id_file) {
            await database.db.none(`
                UPDATE account SET
                    name = $1,
                    id_avatar = $2
                WHERE id_account = $3
            `, [account.name, data.id_file, id_account])
        } else {
            await database.db.none(`
                UPDATE account SET
                    name = $1
                WHERE id_account = $3
            `, [account.name, id_account])
        }
    }).catch( err => {
        console.log("DATABASE saveAccount ERROR: " + err)
        throw err
    })
}

async function getFileByAccountId(id_account) {
    try {
        const file = await database.db.oneOrNone(`
            SELECT f.id_file, f.name FROM account a
            LEFT JOIN file f on a.id_avatar = f.id_file 
            WHERE a.id_account = $1
        `, [id_account])

        return file
    } catch(e) {
        console.log("DATABASE getFileByAccountId ERROR: " + err)
        throw e
    }
}

module.exports = {
    checkEmailUnique,
    register,
    getAccountByEmail,
    getAccountById,
    getAccountRoleById,
    getFileByAccountId,
    saveAccount
}