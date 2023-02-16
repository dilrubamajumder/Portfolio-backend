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

const getAllBooksByUser = async (username) => {
  try {
    const allBooks = await db.any("SELECT * FROM books WHERE added_by=$1", username);
    return allBooks;
  } catch (error) {
    return error;
  }
};

//Create
const createBook = async (book) => {
  try {
    const newBook = await db.one(
      "INSERT INTO books (added_by, primary_review, title, published_year, author, description, category, is_favorite, uri) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",
      [
        book.added_by,
        book.primary_review,
        book.title,
        book.published_year,
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
      "UPDATE books SET primary_review=$1, title=$2, published_year=$3, author=$4, description=$5, category=$6, is_favorite=$7, uri=$8 WHERE id=$9 RETURNING *",
      [
        book.primary_review,
        book.title,
        book.published_year,
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
  getAllBooksByUser,
};
