-- USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE
);

-- ORDERS TABLE
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    product VARCHAR(100),
    amount INT
);

-- INSERT USERS
INSERT INTO users (name, email) VALUES
('Ram', 'ram@gmail.com'),
('Kiran', 'kiran@gmail.com'),
('Anil', 'anil@gmail.com')
ON CONFLICT DO NOTHING;

-- INSERT ORDERS
INSERT INTO orders (user_id, product, amount) VALUES
(1, 'Laptop', 60000),
(2, 'Phone', 15000),
(3, 'Headphones', 2000)
ON CONFLICT DO NOTHING;
