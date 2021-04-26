// Role module

// include mysql, util
const mysql = require('mysql');
const util = require('util');

// connect to database
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

class Role {
    async getRoleById(roleId) {
        const role = await query('SELECT * FROM role WHERE ?',{ id: roleId });
        return role[0].title;
    }

    // returns role title when given ID
    async getRoleById(roleInput) {
        const role = await query('SELECT * FROM role WHERE ?',{ id: roleInput });
        const title = role[0].title;
        return title;
    }

    // returns role ID when given string
    async getRoleByName(roleInput) {
        const role = await query('SELECT * FROM role WHERE ?',{ title: roleInput });

        return role[0].id;
    }

    async getAllRoles() {
        const roles = await query('SELECT * FROM role');
        return roles;
    }

    async getRolesByDept(dept) {
        const role = await query('SELECT * FROM role WHERE ?',{ department_id: `${dept}` });

        return role;
    }

    async createNew(newTitle, newSalary, newDepartment_id) {
        try {
            await query('INSERT INTO role SET ?',
            {
            title: newTitle,
            salary: newSalary,
            department_id: newDepartment_id,
            });
        }
        catch (error) {
            console.log(error);
        }
    }

    async deleteRole(roleID) {
        try {
            await query('DELETE FROM role WHERE ?',
            {
                id: roleID
            });
        }
        catch(error) {
            console.log(error);
        }
    }

}

module.exports = Role;