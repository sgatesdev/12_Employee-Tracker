// db_connect.js
// This file sets up the mysql connection for all modules, exports that connection

// require mysql module
const mysql = require('mysql');

// connect to database - configure to your local settings
// sql will seed into database employee_tracker
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'employee_tracker',
});

connection.connect(function(err) {
    if (err) throw err;
});

module.exports = connection;