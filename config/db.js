const mysql = require('mysql');

const dbConf = mysql.createPool({
    host: 'localhost',
    user: 'AL',
    password: '007@001',
    database: 'eshop'
})

module.exports = { dbConf }