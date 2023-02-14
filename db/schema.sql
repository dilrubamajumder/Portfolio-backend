DROP DATABASE IF EXISTS books_project;
CREATE DATABASE books_project;

\c books_project;

CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    published_year TEXT,
    author VARCHAR(40),
    description TEXT,
    category TEXT,
    is_favorite BOOLEAN,
    uri TEXT DEFAULT 'https://dummyimage.com/400x400/6e6c6e/e9e9f5.png&text=No+Image'
);


DROP TABLE IF EXISTS users;

CREATE TABLE users (
 id SERIAL PRIMARY KEY,
 username TEXT UNIQUE,
 password TEXT
);


DROP TABLE IF EXISTS reviews;

CREATE TABLE reviews (
 id SERIAL PRIMARY KEY,
 reviewer TEXT REFERENCES users (username),
 title TEXT,
 content TEXT,
 rating NUMERIC,
 CHECK (rating >= 0 AND rating <= 5),
 book_id INTEGER REFERENCES books (id)
 ON DELETE CASCADE
);
