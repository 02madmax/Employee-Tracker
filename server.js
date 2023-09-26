const mysql = require('mysql2');
const inquirer = require('inquirer');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'N@la7917',
    database: 'employee_db'
},
console.log(`Connected to the database.`)
);

function mainPrompt() {
    inquirer.prompt({
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: [
            'View all departments',
            'View all roles',
            'View all employees',
            'Add a department',
            'Add a role',
            'Add an employee',
            'Update an employee role',
            'Exit'
        ]
    }).then(response => {
        switch (response.action) {
            case 'View all departments':
                viewAllDepartments();
                break;
            case 'View all roles':
                viewAllRoles();
                break;
            case 'View all employees':
                viewAllEmployees();
                break;
            case 'Add a department':
                addDepartments();
                break;
            case 'Add a role':
                addRoles();
                break;
            case 'Add an employee':
                addEmployees();
                break;
            case 'Update an employee role':
                updateEmployeeRole();
                break;
            case 'Exit':
                db.end();
                break;
        }
    });
}

function viewAllDepartments() {
    db.query('SELECT * FROM departments', function (err, results) {
        if (err) throw err;
        console.table(results);
        mainPrompt();
    });
}

function viewAllRoles() {
    db.query('SELECT * FROM roles', function (err, results) {
        if (err) throw err;
        console.table(results);
        mainPrompt();
    });
}

function viewAllEmployees() {
    db.query('SELECT * FROM employees', function (err, results) {
        if (err) throw err;
        console.table(results);
        mainPrompt();
    });
}

function addDepartments() {
    inquirer.prompt({
        type: 'input',
        name: 'departmentName',
        message: 'Name of department?'
    }).then(response => {
        const sql = `INSERT INTO departments (name) VALUES (?)`;
        db.query(sql, response.departmentName, function (err, results) {
            if (err) throw err;
            console.log('Department added!');
            mainPrompt();
        });
    });
}

function addRoles() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'Roles',
            message: 'Name of Role?'
        },
        {
            type: 'input',
            name: 'salary',
            message: 'Salary of Role?'
        },
        {
            type: 'list',
            name: 'roleChoice',
            message: 'Department of Role?',
            choices: [
                'Sales',
                'Engineering',
                'Finance',
                'Legal'
            ]
        }
    ]).then(response => {
        db.query(`SELECT id FROM departments WHERE name = ?`, [response.roleChoice], function (err, results) {
            if (err) throw err;
            const departmentId = results[0].id;
            const sql = `INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)`;
            const params = [response.Roles, response.salary, departmentId];
            db.query(sql, params, function (err, results) {
                if (err) throw err;
                console.log('Role added!');
                mainPrompt();
            });
        });
    });
}

function addEmployees() {
    inquirer.prompt({
        type: 'input',
        name: 'employees',
        message: 'Name of employee?'
    }).then(response => {
        db.query('INSERT INTO employees (name) VALUES (?)', [response.employees], function (err, results) {
            if (err) throw err;
            console.log('Employee added!');
            mainPrompt();
        });
    });
}

function updateEmployeeRole() {
    // TODO: Implement this function
    console.log('Feature not yet implemented!');
    mainPrompt();
}

mainPrompt();
