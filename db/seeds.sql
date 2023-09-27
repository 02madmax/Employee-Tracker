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

INSERT INTO employees (id, name, role_id, manager_id) VALUES
(1, 'John Doe', 1, 1),
(2, 'Jane Smith', 2, 2),
(3, 'Emily Clark', 3, 2),
(4, 'Mike Chan', 4, 1);
