const mysql = require('mysql2');
const inquirer = require('inquirer');

const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'N@la7917',
    database: 'employees_db'
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
    inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'Name of Employee?'
        },
        {
            type: 'list',
            name: 'role',
            message: 'Role of Employee?',
            choices: [
                'Sales Rep',
                'Software Engineer',
                'Financial Analyst',
                'Lawyer'
            ]
        },
        {
            type: 'list',
            name: 'manager',
            message: 'Manager of Employee?',
            choices: [
                'John Doe',
                'Mike Chan',
            ]
        }
    ]).then(response => {
        // Get role_id for the chosen role
        db.query(`SELECT id FROM roles WHERE title = ?`, [response.role], function(err, roleResults) {
            if (err) throw err;

            if (roleResults.length === 0) {
                console.error(`No role found with the title: ${response.role}`);
                mainPrompt();
                return;
            }

            const roleId = roleResults[0].id;

            // Get manager_id for the chosen manager
            db.query(`SELECT id FROM employees WHERE name = ?`, [response.manager], function(err, managerResults) {
                if (err) throw err;

                if (managerResults.length === 0) {
                    console.error(`No employee found with the name: ${response.manager}`);
                    mainPrompt();
                    return;
                }

                const managerId = managerResults[0].id;

                // Now, insert the new employee with the role_id and manager_id
                const sql = `INSERT INTO employees (name, role_id, manager_id) VALUES (?, ?, ?)`;
                const params = [response.name, roleId, managerId];
                db.query(sql, params, function(err, results) {
                    if (err) throw err;
                    console.log('Employee added!');
                    mainPrompt();
                });
            });
        });
    });
}


function updateEmployeeRole() {
    // First, fetch all employees for selection
    db.query('SELECT id, name FROM employees', (err, employeeResults) => {
        if (err) throw err;

        // Transform employee results to be usable in the inquirer choices
        const employeeChoices = employeeResults.map(employee => ({
            name: employee.name,
            value: employee.id
        }));

        // Fetch all roles for selection
        db.query('SELECT id, title FROM roles', (err, roleResults) => {
            if (err) throw err;

            // Transform role results to be usable in the inquirer choices
            const roleChoices = roleResults.map(role => ({
                name: role.title,
                value: role.id
            }));

            // Ask the user which employee they want to update and the new role
            inquirer.prompt([
                {
                    type: 'list',
                    name: 'employeeId',
                    message: 'Which employee do you want to update?',
                    choices: employeeChoices
                },
                {
                    type: 'list',
                    name: 'roleId',
                    message: 'What is the new role for this employee?',
                    choices: roleChoices
                }
            ]).then(response => {
                // Update the employee's role in the database
                const sql = `UPDATE employees SET role_id = ? WHERE id = ?`;
                db.query(sql, [response.roleId, response.employeeId], (err, results) => {
                    if (err) throw err;
                    console.log('Employee role updated!');
                    mainPrompt();
                });
            });
        });
    });
}


mainPrompt();
