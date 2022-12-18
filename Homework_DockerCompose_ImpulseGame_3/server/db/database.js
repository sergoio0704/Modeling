const initOptions = require('./database.properties');

const pgp = require('pg-promise')();
const db = pgp(initOptions);

module.exports = {
    db, pgp
};
