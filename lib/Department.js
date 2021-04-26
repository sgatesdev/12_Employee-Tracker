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

class Department {
    constructor() {

    }

    async createNew(dept) {
        try {
            await query('INSERT INTO department SET ?',
            {
            name: dept,
            });
        }
        catch(error) {
            console.log(error);
        }
    }

    async allDepartments() {
        try {
            let results = await query('SELECT * FROM department');
            return results;
        }
        catch(error) {
            console.log(error);
        }   
    }

    async deleteDepartment(dept) {
        try {
            await query('DELETE FROM department WHERE ?',
            {
                name: dept
            });
            }
        catch(error) {
            console.log(error);
        }
    }

    async getIdByName(dept) {
        try {
            let results = await query('SELECT * FROM department WHERE ?', {name: dept});
            return results[0].id;
        }
        catch(error) {
            console.log(error);
        }   
    }
}

module.exports = Department;