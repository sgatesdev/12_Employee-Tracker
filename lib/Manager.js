// Manager module

// require Employee module, since Manager extends Employee
const Employee = require('./Employee');

// connect to database
const { connection, query } = require('../db_connect');

class Manager extends Employee {
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

    closeConnection () {
        connection.end();
    }
}

module.exports = Manager;