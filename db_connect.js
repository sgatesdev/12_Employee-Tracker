// db_connect.js
// This file sets up the mysql connection for all modules, exports that connection

// require mysql module
const mysql = require('mysql');
// require Util so I can use promisify
const util = require('util');

// connect to database - configure to your local settings
// sql will seed into database employee_tracker
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'rXwAP9eJ',
    database: 'employee_tracker',
});

connection.connect((err) => {
    if (err) throw err;
});

// use promisify so that I can use async/await with query
let query = util.promisify(connection.query).bind(connection);

module.exports = { connection, query };