const inquirer = require('inquirer');

// import modules for working with different employees
const Employee = require('./lib/Employee');
const Manager = require('./lib/Manager');
const Role = require('./lib/Role');
const Department = require('./lib/Department');

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
                    process.exit();
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
                    init();
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

                    await thisEmployee.switchManager(managerId);
                    console.log('\n********* Updated manager!\n');

                    modifyManager();
                }
            });
        
    }
    });
}

// create, view, delete departments, view combined salaries in dept
function departments() {
    console.log('\n********* Departments');

    inquirer
    .prompt({
        name: 'option',
        type: 'list',
        message: 'What would you like to do?',
        choices: ['Add','Delete','View all','Payroll','Exit'],
        })
        .then((answer) => {
            // send the user where they want to go
            switch(answer.option) {
                case 'Add':
                    addDepartment();
                    break;
                case 'Delete':
                    deleteDepartment();
                    break;
                case 'View all':
                    viewDepartments();
                    break;
                case 'Payroll':
                    viewPayroll();
                    break;
                default:
                    init();
                    break;
            }
       });
}

// add department
function addDepartment() {
    // gather user input
    inquirer
    .prompt([
        {
            name: 'name',
            type: 'input',
            message: 'Department name: ',
            default: 'Accounting'
        }
    ])
    .then(async (department) => {
        // add department to database
        let departmentTools = new Department();
        await departmentTools.createNew(department.name);

        console.log('\n********* Added department!\n');
        // take user back to employee menu
        departments();
    });
}

// delete department
async function deleteDepartment() {
    const departmentTools = new Department();
    const rawList = await departmentTools.allDepartments();

    // build menu list of items
    let departmentList = [];

    rawList.forEach(department => departmentList.push(department.name));
       
    // add exit option
    departmentList.push('Exit');

    inquirer
    .prompt([
        {
            name: 'name',
            type: 'list',
            message: 'Which department do you want to delete?',
            choices: departmentList
        }
    ])
    .then(async (dept) => {
        if (dept.name === 'Exit') {
            departments();
        }
        else {
            // use the magic of classes to clean this up!
            await departmentTools.deleteDepartment(dept.name);

            console.log('\n********* Deleted department!\n');

            departments();
        }
    });
}

// view departments
async function viewDepartments() {
    const getDepartments = new Department();
    const departmentTable= await getDepartments.allDepartments();
    let table = new Object();
    departmentTable.forEach(dept => {
        table[dept.id] = dept.name;
    })

    console.table(table);

    departments();
}

// view payroll
async function viewPayroll() {
    // find which roles use this deparment
    // then add up how many people are in those roles
    // combine salaries, produce total number
    const departmentTools = new Department();
    const rawList = await departmentTools.allDepartments();

    // build menu list of items
    let departmentList = [];

    rawList.forEach(department => departmentList.push(department.name));
       
    // add exit option
    departmentList.push('Exit');

    inquirer
    .prompt([
        {
            name: 'name',
            type: 'list',
            message: 'Which department do you want to view payroll for?',
            choices: departmentList
        }
    ])
    .then(async (dept) => {
        if (dept.name === 'Exit') {
            departments();
        }
        else {
            // convert name to database ID
            let departmentId = await departmentTools.getIdByName(dept.name);
            
            // get roles that use that ID
            let roleTools = new Role();
            let roles = await roleTools.getRolesByDept(departmentId);

            let employeeTools = new Employee();
            let employeeList = await employeeTools.allEmployees();
            let budget = 0;
            
            if(roles.length > 0) {
                for(let i = 0; i < roles.length; i++) {
                    let salary = roles[i].salary;
                    for(let n = 0; n < employeeList.length; n++) {
                        if (employeeList[n].role_id === roles[i].id) {
                            budget += salary;
                        }
                    }
                }
                console.log('\nTotal budget: ' + budget);
            }
            else {
                console.log('\nNo employees! Saving that money.');
            }

            departments();
        }
    });
}

// create, view, delete roles
function roles() {
    console.log('\n********* Roles');

    inquirer
    .prompt({
        name: 'option',
        type: 'list',
        message: 'What would you like to do?',
        choices: ['Add','Delete','View all','Exit'],
        })
        .then((answer) => {
            // send the user where they want to go
            switch(answer.option) {
                case 'Add':
                    addRole();
                    break;
                case 'Delete':
                    deleteRole();
                    break;
                case 'View all':
                    viewRoles();
                    break;
                default:
                    init();
                    break;
            }
       });
}

// add a new role
async function addRole() {
    const departmentTools = new Department();
    const rawList = await departmentTools.allDepartments();
    
    // build menu list of items
    let departmentList = [];

    rawList.forEach(department => departmentList.push(department.name));
       
    // add exit option
    departmentList.push('Exit');

    inquirer
    .prompt([
        {
            name: 'title',
            type: 'input',
            message: 'New department title: '
        },
        {
            name: 'salary',
            type: 'input',
            message: 'Salary: '
        },
        {
            name: 'department',
            type: 'list',
            message: 'Which department is this role in?',
            choices: departmentList
        }
    ])
    .then(async (role) => {
        if (role.name === 'Exit') {
            roles();
        }
        else {
            // get department ID
            let departmentId = await departmentTools.getIdByName(role.department);

            // create role
            let roleTools = new Role();
            await roleTools.createNew(role.title, role.salary, departmentId);

            console.log('\n********* Added role!\n');
            roles();
        }
    });
}

// delete a role 
async function deleteRole() {
    const roleTools = new Role();
    const rawList = await roleTools.getAllRoles();

    // build menu list of items
    let roleList = [];

    rawList.forEach(role => roleList.push(role.title));
       
    // add exit option
    roleList.push('Exit');

    inquirer
    .prompt([
        {
            name: 'name',
            type: 'list',
            message: 'Which role do you want to delete?',
            choices: roleList
        }
    ])
    .then(async (role) => {
        if (role.name === 'Exit') {
            roles();
        }
        else {
            let roleId = await roleTools.getRoleByName(role.name);
            await roleTools.deleteRole(roleId);

            console.log('\n********* Deleted role!\n');

            roles();
        }
    });
}

// view all roles 
async function viewRoles() {
    const getRoles = new Role();
    const roleTable = await getRoles.getAllRoles();

    let table = new Object();
    roleTable.forEach(role => {
        table[role.id] = {Name: role.title, Salary: role.salary};
    })

    console.table(table);

    roles();
}