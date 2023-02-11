const db = require("../db/dbConfig.js");

//Index
const getAllBooks = async () => {
  try {
    const allBooks = await db.any("SELECT * FROM books");
    return allBooks;
  } catch (error) {
    return error;
  }
};
//Show
const getOneBook = async (id) => {
  try {
    const oneBook = await db.one("SELECT * FROM books WHERE id=$1", id);
    return oneBook;
  } catch (error) {
    return error;
  }
};

//Create
const createBook = async (book) => {
  try {
    const newBook = await db.one(
      "INSERT INTO books (title, year, author, description, category, is_favorite, uri) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [
        book.title,
        book.year,
        book.author,
        book.description,
        book.category,
        book.is_favorite,
        book.uri,
      ]
    );
    return newBook;
  } catch (error) {
    return error;
  }
};

//Delete
const deleteBook = async (id) => {
  try {
    const deletedBook = await db.one(
      "DELETE FROM books WHERE ID =$1 RETURNING *",
      id
    );
    return deletedBook;
  } catch (error) {
    return error;
  }
};

//Update
const updateBook = async (id, book) => {
  try {
    const updatedBook = await db.one(
      "UPDATE books SET title=$1, year=$2, author=$3, description=$4, category=$5, is_favorite=$6, uri=$7 WHERE id=$8 RETURNING *",
      [
        book.title,
        book.year,
        book.author,
        book.description,
        book.category,
        book.is_favorite,
        book.uri,
        id,
      ]
    );
    return updatedBook;
  } catch (error) {
    error;
  }
};

module.exports = {
  getAllBooks,
  getOneBook,
  createBook,
  deleteBook,
  updateBook,
};
