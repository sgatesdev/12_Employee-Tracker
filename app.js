const mysql = require('mysql');
const inquirer = require('inquirer');

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
                    connection.end();
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
        choices: ['Add','Update manager','Update role','Delete ','View all employees','View by manager','Exit'],
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
                    viewEmployees();
                    break;
                default:
                    init();
                    break;
            }
       });
}

// add an employee
function addEmployee() {
    connection.query('SELECT * FROM role', (err, roles) => {
        // error handling
        if (err) throw err;
        // if no error, dump roles into array for menu 
        let roleList = [];
        roles.forEach(role => roleList.push(role.id + '. ' + role.title));
        //console.log(roleList);

        inquirer
        .prompt([
            {
                name: 'first_name',
                type: 'input',
                message: 'First name: ',
                default: 'Sam'
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
        .then((employee) => {
                // convert role choice into DB id for that role
                let roleId = employee.Role.substr(0,1);

                // insert employee into DB
                connection.query(
                    'INSERT INTO employee SET ?',
                    // QUESTION: What does the || 0 do?
                    {
                      first_name: employee.first_name,
                      last_name: employee.last_name,
                      role_id: `${roleId}`,
                    },
                    (err) => {
                      if (err) throw err;
                      console.log('Employee added!');
                      
                      // redirect user back to employee start
                      employees();
                    }
                );
        });
    });
}

// view employees
function viewEmployees() {
    connection.query('SELECT * FROM employee', (err, results) => {
        // if there's an error
        if (err) throw err;
    
        // dump results into object
        var employeeList = {};
        results.forEach(employee => {
            employeeList[employee.id] = employee.first_name + ' ' + employee.last_name; 
        });

        // display to table
        console.table(employeeList);

        // go back to employee menu
        employees();
    });
}

//change employee role
function modifyRole() {
    var employeeId = -1;

    connection.query('SELECT * FROM employee', (err, employees) => {
        // error handling
        if (err) throw err;
        // if no error, dump roles into array for menu 
        let employeeList = [];
        employees.forEach(employee => employeeList.push(employee.id + '. ' + employee.first_name + ' ' + employee.last_name));
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
        .then((employee) => {
            if (employee.name === 'Exit') {
                connection.end();
            }
            else {
                employeeId = employee.name.substr(0,employee.name.indexOf('.'));

                connection.query('SELECT * FROM role', (err, roles) => {
                    // error handling
                    if (err) throw err;

                    // else build menu of roles
                    let roleList = [];
                    roles.forEach(role => roleList.push(role.id + '. ' + role.title + ' $' + role.salary));

                    // add exit option
                    roleList.push('Exit');

                    inquirer
                    .prompt([
                        {
                            name: 'name',
                            type: 'list',
                            message: 'Which role do you want to use?',
                            choices: roleList
                        }
                    ])
                    .then((role) => {
                        if (employee.name === 'Exit') {
                            connection.end();
                        }
                        else {
                            // get role ID
                            let roleId = role.name.substr(0,role.name.indexOf('.'));
                            console.log(employeeId);
                            
                            connection.query(
                                'UPDATE employee SET ? WHERE ?',
                                [
                                  {
                                    role_id: roleId,
                                  },
                                  {
                                    id: employeeId,
                                  },
                                ],
                                (error) => {
                                  if (error) throw err;
                                  
                                  console.log('\n********* Updated employee role!');

                                  modifyRole();
                                }
                              );
                        }
                    });
                });
            }
        });
    });
}

//change employee manager
function modifyManager() {
    var employeeID = -1;

    connection.query('SELECT * FROM employee', (err, roles) => {
        // error handling
        if (err) throw err;
        // if no error, dump roles into array for menu 
        let employeeList = [];
        roles.forEach(employee => employeeList.push(employee.id + '. ' + employee.first_name + ' ' + employee.last_name));
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
        .then((employee) => {
            if (employee.name === 'Exit') {
                connection.end();
            }
            else {
                employeeID = employee.name.substr(0,employee.name.indexOf('.'));

                connection.query('SELECT employee.id, employee.first_name, employee.last_name FROM role LEFT JOIN employee ON employee.role_id=role.id WHERE role.title="Manager" ORDER BY employee.id', (err, managers) => {
                    // error handling
                    if (err) throw err;
                    //console.log(managers);

                    // else build menu of managers
                    let managerList = [];
                    managers.forEach(manager => managerList.push(manager.id + '. ' + manager.first_name + ' ' + manager.last_name));

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
                    .then((manager) => {
                        if (employee.name === 'Exit') {
                            connection.end();
                        }
                        else {
                            // get manager ID from name
                            let managerId = manager.name.substr(0,manager.name.indexOf('.'));

                            connection.query(
                                'UPDATE employee SET ? WHERE ?',
                                [
                                  {
                                    manager_id: managerId,
                                  },
                                  {
                                    id: employeeID,
                                  },
                                ],
                                (error) => {
                                  if (error) throw err;
                                  console.log('\n********* Updated manager!\n');

                                  modifyManager();
                                }
                              );
                        }
                    });
                });
            }
        });
    });
}

// create, view, delete departments, view combined salaries in dept
function departments() {

}

// create, view, delete roles
function roles() {

}