const inquirer = require('inquirer');

// import modules for working with different employees
const Employee = require('./lib/Employee');
const Manager = require('./lib/Manager');
const Role = require('./lib/Role');

init();

// beginning
function init() {
    console.log('\n\nWelcome to the Employee Tracker! This simple app will allow you to manage your business. Please select an item below.\n\n');

    inquirer
    .prompt({
        name: 'option',
        type: 'list',
        message: 'What part of your business would you like to manage today?',
        choices: ['Employees', 'Departments', 'Roles','Exit'],
        })
        .then((answer) => {
            // send the user where they want to go
            switch(answer.option) {
                case 'Employees':
                    employees();
                    break;
                case 'Departments':
                    departments();
                    break;
                case 'Roles':
                    roles();
                    break;
                default:
                    break;
            }
 
       });
}

// create, view, change employee roles, update manager assignment, delete employees
function employees() {
    console.log('\n********* Employee');

    inquirer
    .prompt({
        name: 'option',
        type: 'list',
        message: 'What would you like to do?',
        choices: ['Add','Update manager','Update role','Delete','View all employees','View by manager','Exit'],
        })
        .then((answer) => {
            // send the user where they want to go
            switch(answer.option) {
                case 'Add':
                    addEmployee();
                    break;
                case 'Update manager':
                    modifyManager();
                    break;
                case 'Update role':
                    modifyRole();
                    break;
                case 'Delete':
                    deleteEmployee();
                    break;
                case 'View all employees':
                    viewEmployees();
                    break;
                case 'View by manager':
                    viewEmployeesMgr();
                    break;
                default:
                    break;
            }
       });
}

// add an employee
async function addEmployee() {
        // use role methods to get all roles
        let roleTools = new Role();
        let roles = await roleTools.getAllRoles();
        
        // build list for inquirer
        let roleList = [];
        roles.forEach(role => roleList.push(role.title));

        inquirer
        .prompt([
            {
                name: 'first_name',
                type: 'input',
                message: 'First name: ',
                default: 'John'
            },
            {
                name: 'last_name',
                type: 'input',
                message: 'Last name: ',
                default: 'Smith'
            },
            {
                name: 'Role',
                type: 'list',
                choices: roleList
            }
        ])
        .then(async (employee) => {
            // convert role choice into DB id for that role
            let roleId = await roleTools.getRoleByName(employee.Role);
            let employeeTools = new Employee();

            // add employee to database
            await employeeTools.createNew(employee.first_name, employee.last_name, roleId);

            // display success message
            
            console.log('\n********* Added employee!\n');
            // take user back to employee menu
            
            employees();
        });
}

async function deleteEmployee() {
    const employeeTools = new Employee();
    const rawList = await employeeTools.allEmployees();
    
    // build menu list of items
    let employeeList = [];

    rawList.forEach(employee => employeeList.push(employee.first_name + ' ' + employee.last_name));
       
    // add exit option
    employeeList.push('Exit');

    inquirer
    .prompt([
        {
            name: 'name',
            type: 'list',
            message: 'Which employee do you want to delete?',
            choices: employeeList
        }
    ])
    .then(async (employee) => {
        if (employee.name === 'Exit') {
            employees();
        }
        else {
            // use the magic of classes to clean this up!
            let thisEmployee = new Employee(employee.name);
            await thisEmployee.popInfoByName();
            await thisEmployee.deleteEmployee();

            console.log('\n********* Deleted employee!\n');

            employees();
        }
    });
}

// view employees
async function viewEmployees() {
    const getEmployees = new Employee();
    const employeeTable = await getEmployees.employeesByRole();
    console.table(employeeTable);
    employees();
}

// view employees by manager
async function viewEmployeesMgr() {
    const getEmployees = new Employee();
    const employeeTable = await getEmployees.employeesByManager();
    console.table(employeeTable);
    employees();
}

//change employee role
async function modifyRole() {
    const employeeTools = new Employee();
    const rawList = await employeeTools.allEmployees();
    
    // build menu list of items
    let employeeList = [];

    rawList.forEach(employee => employeeList.push(employee.first_name + ' ' + employee.last_name));
       
    // add exit option
    employeeList.push('Exit');

    inquirer
    .prompt([
        {
            name: 'name',
            type: 'list',
            message: 'Which employee do you want to change the role for?',
            choices: employeeList
        }
    ])
    .then(async (employee) => {
        if (employee.name === 'Exit') {
            init();
        }
        else {
            // use the magic of classes to clean this up!
            let thisEmployee = new Employee(employee.name);
            await thisEmployee.popInfoByName();

            // get list of all roles
            const roleTools = new Role();
            const roles = await roleTools.getAllRoles();

            // build menu list
            let roleList = [];
            roles.forEach(role => roleList.push(role.title));

            // add exit option
            roleList.push('Exit');

            // ask which role to switch employee
            inquirer
            .prompt([
                {
                    name: 'name',
                    type: 'list',
                    message: 'Which role do you want to use?',
                    choices: roleList
                }
            ])
            .then(async (role) => {
                if (employee.name === 'Exit') {
                    connection.end();
                }
                else {
                    // get manager ID and then use switchManager to switch
                    let roleId = await roleTools.getRoleByName(role.name);

                    try {
                        await thisEmployee.switchRole(roleId);
                        console.log('\n********* Updated role!\n');

                    }
                    catch(error) {
                        console.log(error);
                    }
                    modifyRole();
                }
            });
        }
    });
}

//change employee manager
async function modifyManager() {
    const employeeTools = new Employee();
    const rawList = await employeeTools.allEmployees();
    
    // build menu list of items
    let employeeList = [];

    rawList.forEach(employee => employeeList.push(employee.first_name + ' ' + employee.last_name));
       
    // add exit option
    employeeList.push('Exit');

    inquirer
    .prompt([
        {
            name: 'name',
            type: 'list',
            message: 'Which employee do you want to change the manager for?',
            choices: employeeList
        }
    ])
    .then(async (employee) => {
        if (employee.name === 'Exit') {
            employees();
        }
        else {
            // use the magic of classes to clean this up!
            let thisEmployee = new Employee(employee.name);
            await thisEmployee.popInfoByName();

            // get list of all managers
            const managerTools = new Manager();
            const managers = await managerTools.getAllManagers();

            // build menu list
            let managerList = [];
            managers.forEach(manager => managerList.push(manager.first_name + ' ' + manager.last_name));

            // add exit option
            managerList.push('Exit');

            inquirer
            .prompt([
                {
                    name: 'name',
                    type: 'list',
                    message: 'Which manager do you want to use?',
                    choices: managerList
                }
            ])
            .then(async (manager) => {
                if (manager.name === 'Exit') {
                    employees();
                }
                else {
                    // get manager ID and then use switchManager to switch
                    let managerId = await managerTools.getManagerByName(manager.name);

                    try {
                        await thisEmployee.switchManager(managerId);
                        console.log('\n********* Updated manager!\n');

                    }
                    catch(error) {
                        console.log(error);
                    }
                    modifyManager();
                }
            });
        
    }
    });
}
// create, view, delete departments, view combined salaries in dept
function departments() {

}

// create, view, delete roles
function roles() {

}

async function getRole(employee) {
    // node native promisify
    const query = util.promisify(connection.query).bind(connection);

    try {
        const result = await query('SELECT * FROM employee WHERE ?', 
        {
            id: employee,
        });
        //console.log(result);

        const result2 = await query('SELECT * FROM employee WHERE ?', 
        {
            id: 5,
        });

        console.log(result);
        console.log(result2);
    }   
    catch (error) {
        console.log(error);
    }
}