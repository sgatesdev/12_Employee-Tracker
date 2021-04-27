// Department module
 
// connect to database
const { connection, query } = require('../db_connect');

class Department {
    // create new Department given user input of name
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
    // return all departments in DB
    async allDepartments() {
        try {
            let results = await query('SELECT * FROM department');
            return results;
        }
        catch(error) {
            console.log(error);
        }   
    }
    // delete department using name
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
    // get column "id" given name
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