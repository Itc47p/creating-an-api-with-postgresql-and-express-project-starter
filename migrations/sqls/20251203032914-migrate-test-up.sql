CREATE TABLE plants (
    id SERIAL PRIMARY KEY,
    species VARCHAR(50),
    description VARCHAR(100),
    sighted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);