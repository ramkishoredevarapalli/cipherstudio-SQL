 CREATE TABLE IF NOT EXISTS users (
id SERIAL PRIMARY KEY,
name VARCHAR(100) NOT NULL,
email VARCHAR(100) UNIQUE NOT NULL
);
CREATE TABLE IF NOT EXISTS orders (
id SERIAL PRIMARY KEY,
user_id INTEGER NOT NULL,
product VARCHAR(100),
amount INTEGER,
FOREIGN KEY (user_id) REFERENCES users(id)
);
INSERT INTO users (name, email)
SELECT 'Ram', 'ram@gmail.com'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'ram@gmail.com');
INSERT INTO users (name, email)
SELECT 'Kiran', 'kiran@gmail.com'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'kiran@gmail.com');
INSERT INTO users (name, email)
SELECT 'Anil', 'anil@gmail.com'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'anil@gmail.com');
INSERT INTO orders (user_id, product, amount)
VALUES
(1, 'Laptop', 60000),
(2, 'Phone', 15000),
(3, 'Headphones', 2000);
