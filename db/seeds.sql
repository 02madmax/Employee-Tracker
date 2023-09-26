INSERT INTO departments (name) VALUES
('Sales'),
('Engineering'),
('Finance'),
('Legal');


INSERT INTO roles (title, salary, department_id) VALUES
('Sales Rep', 50000, 1),
('Software Engineer', 90000, 2),
('Financial Analyst', 70000, 3),
('Lawyer', 100000, 4);

INSERT INTO employees (id, first_name, last_name, role_id, manager_id) VALUES
(1, 'John', 'Doe', 1, NULL),
(2, 'Jane', 'Smith', 2, 1),
(3, 'Emily', 'Clark', 3, 1);
(4, 'Bob', 'Smith', 4, 1);