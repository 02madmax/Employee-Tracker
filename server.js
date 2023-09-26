const express = require('express');
// Import and require mysql2
const mysql = require('mysql2');

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    // MySQL username,
    user: 'root',
    // MySQL password
    password: 'N@la7917',
    database: 'employee_db'
  },
  console.log(`Connected to the books_db database.`)
);

const inquirer = require('inquirer');

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
      // ... handle other cases similarly ...
      case 'Exit':
        connection.end();
        break;
    }
  });
}

function viewAllDepartments() {
    connection.query('SELECT * FROM department', function (err, results) {
        if (err) throw err;
        console.table(results);
        mainPrompt();
    });
}

function viewAllRoles() {
    connection.query('SELECT * FROM role', function (err, results) {
        if (err) throw err;
        console.table(results);
        mainPrompt();
    });
}

function viewAllEmployees() {
    connection.query('SELECT * FROM employee', function (err, results) {
        if (err) throw err;
        console.table(results);
        mainPrompt();
    });
}

function addDepartment() {
    inquirer.prompt({
        type: 'input',
        name: 'department',
        message: 'Name of department?'
    }).then(response => {
        connection.query('INSERT INTO department (name) VALUES (?)', { name: response.department }, function (err, results) {
            if (err) throw err;
            console.log('Department added!');
            mainPrompt();
        });
    });
}

function addRole() {
    inquirer.prompt({
        type: 'input',
        name: 'Role',
        message: 'Name of Role?'
    }).then(response => {
        connection.query('INSERT INTO role (name) VALUES (?)', { name: response.role }, function (err, results) {
            if (err) throw err;
            console.log('Role added!');
            mainPrompt();
        });
    });
}

function addEmployee() {
    inquirer.prompt({
        type: 'input',
        name: 'employee',
        message: 'Name of employee?'
    }).then(response => {
        connection.query('INSERT INTO employee (name) VALUES (?)', { name: response.employee }, function (err, results) {
            if (err) throw err;
            console.log('Department added!');
            mainPrompt();
        });
    });
}

mainPrompt();
// Query database
// db.query('SELECT * FROM favorite_books', function (err, results) {
//   console.log(results);
// });

// Default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
