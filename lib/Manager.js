const Employee = require('./Employee');

// include mysql 
const mysql = require('mysql');
const util = require('util');

const connection = mysql.createConnection({
    host: 'localhost',
  
    // Your port; if not 3306
    port: 3306,
  
    // Your username
    user: 'root',
  
    // Your password
    password: 'rXwAP9eJ',
    database: 'employee_tracker',
 });

 // use promisify to allow me to use async/await with MySQL queries
const query = util.promisify(connection.query).bind(connection);

class Manager extends Employee {
    constructor() {
        super();
    }

    // returns manager name when given ID
    async getManagerById(mgr) {
        const manager = await query('SELECT * FROM employee WHERE ?',{ id: mgr });
        const name = manager[0].first_name + ' ' + manager[0].last_name;
        return name;
    }

    // returns manager ID when given string
    async getManagerByName(mgr) {
        let fullName = mgr.split(' ');
        let firstName = fullName[0];
        let lastName = fullName[1];

        const manager = await query('SELECT * FROM employee WHERE ? AND ?',[{ first_name: firstName },{ last_name: lastName}]);

        return manager[0].id;
    }

    async getAllManagers() {
        const managers = await query('SELECT * FROM employee WHERE ?',{ role_id: 2 });
        return managers;
    }
}

module.exports = Manager;