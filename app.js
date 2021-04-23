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
                    employeesLanding();
                    break;
                case 'Departments':
                    departmentsLanding();
                    break;
                case 'Roles':
                    rolesLanding();
                    break;
                default:
                    connection.end();
                    break;
            }
}

// create, view, delete departments, view combined salaries in dept
function departmentsLanding() {

}

// create, view, delete roles
function rolesLanding() {

}

// create, view, change employee roles, update manager assignment, delete employees
function employeesLanding() {

}



function exit() {

}