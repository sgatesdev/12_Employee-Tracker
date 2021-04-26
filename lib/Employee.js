// Employee module, where it all began

// include mysql 
const mysql = require('mysql');
const util = require('util');

 // use promisify to allow me to use async/await with MySQL queries
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

  let query = util.promisify(connection.query).bind(connection);

// store functions inside class to make SQL queries easy!
class Employee {
    // build employee object
    constructor(identifier) {
        // if passed a number, it's the employee id, so build info from that
        if(!isNaN(identifier)) {
            this.employee_id = identifier;
        }
        // otherwise we've been given a name, so go with that
        else if (identifier) {
            let temp = identifier.split(' ');
            this.first_name = temp[0];
            this.last_name = temp[1];
        }
    }
    // this method populates the object with tons of relevant information for easy access
    // run this if you passed a string to the constructor
    async popInfoByName() {
        const result = await query('SELECT * FROM employee WHERE ? AND ?', 
        [{
            first_name: this.first_name,
        },
        {
            last_name: this.last_name,
        }]
        );

        // set object variables 
        this.role_id = result[0].role_id;
        this.manager_id = result[0].manager_id;
        this.employee_id = result[0].id;

    }

    // this method populates object with relevant information for easy access
    // run this if you passed a number to the constructor
    async popInfoById() {
        const result = await query('SELECT * FROM employee WHERE ?', 
        {
            id: this.employee_id,
        });


        // set object variables 
        this.role_id = result[0].role_id;
        this.manager_id = result[0].manager_id;
        this.first_name = result[0].first_name;
        this.last_name = result[0].last_name;
    }

    getEmployeeId() {
        return this.employee_id;
    }

    getManagerId() {
       return this.manager_id;
    }

    getRoleId() {
        return this.role_id;
    }

    async employeesByRole() {
        // return all employees
        const employees = await query('SELECT * FROM employee');
        const roles = await query('SELECT * FROM role');
        let table = new Object();

        for(let i = 0; i < employees.length; i++) {
            for(let n = 0; n < roles.length; n++) {
                if (employees[i].role_id === roles[n].id) {
                    table[employees[i].id] = {Employee: employees[i].first_name + ' ' + employees[i].last_name, Role: roles[n].title}
                }
            }
        }

        return table;
    }

    async employeesByManager() {
        // return all employees
        const employees = await query('SELECT * FROM employee');

        let table = new Object();

        for(let i = 0; i < employees.length; i++) {
            // database is seeded with manager position at 2
            try {
                const managers = await query(`SELECT * FROM employee WHERE id=${employees[i].manager_id} ORDER BY manager_id ASC`);
                let managerName = '';

                if(managers[0]) {
                    managerName = managers[0].first_name + ' ' + managers[0].last_name;
                }
                else {
                    managerName = 'None';
                }

                table[employees[i].id] = {Employee: employees[i].first_name + ' ' + employees[i].last_name, Manager: managerName};
                
            }
            catch(error) {
                console.log(error);
            }
        }

        return table;
    }

    async allEmployees() {
        const employees = await query('SELECT * FROM employee');

        return employees;
    }

    // switch manager
    async switchManager(newMgr) {
        try {
            await query('UPDATE employee SET ? WHERE ?',
            [
                {
                manager_id: newMgr,
                },
                {
                id: this.employee_id,
                },
            ]);

            return true;
        }
        catch(error) {
            console.log(error);
        }
    }

    // switch role for user 
    async switchRole(newRole) {
        try {
            await query('UPDATE employee SET ? WHERE ?',
            [
                {
                role_id: newRole,
                },
                {
                id: this.employee_id,
                },
            ]);

            return true;
        }
        catch(error) {
            console.log(error);
        }
    }

    async closeConnection() {
        connection.end();
    }

    async createNew(first, last, role) {
        try {
            await query('INSERT INTO employee SET ?',
            {
            first_name: first,
            last_name: last,
            role_id: role,
            });
        }
        catch(error) {
            console.log(error);
        }
    }

    async deleteEmployee() {
        try {
            await query('DELETE FROM employee WHERE ?',
            {
                id: this.employee_id
            });
        }
        catch(error) {
            console.log(error);
        }
    }

    async closeConnection() {
        connection.end((err) => console.log(err));
    }
}

module.exports = Employee;