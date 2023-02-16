const express = require("express");
const books = express.Router();
const {
  getAllBooks,
  getOneBook,
  createBook,
  deleteBook,
  updateBook,
  getAllBooksByUser,
} = require("../queries/books");
const { getAllReviews } = require('../queries/reviews');
const authenticate = require('./auth')
const {nameCap, checkBoolean, checkAuthor, checkTitle } = require("../Helpers/helper")

const reviewsController = require('./reviewsController')
books.use('/:bookId/reviews', reviewsController)




//Index
books.get("/", async (req, res) => {
  const allBooks = await getAllBooks();
  if (allBooks[0]) {
    res.status(200).json(allBooks)
  }else{
    res.status(500).json({error: "server error"})
  }
});

// Get all books belonging to logged in user
books.get("/user-books", authenticate, async (req, res) => {
  const { username } = req
  const allBooks = await getAllBooksByUser(username);
  if (allBooks[0]) {
    res.status(200).json(allBooks)
  }else{
    res.status(500).json({error: "server error"})
  }
});


//Show
books.get("/:id", async (req, res) => {
    const { id } = req.params;
    const oneBook = await getOneBook(id);
    const allReviews = await getAllReviews(id)
  
    if (!oneBook.message) {
      res.status(200).json({ bookInfo: oneBook, reviews: allReviews });
    } else {
      res.status(404).json({ error: "not found" });
    }
  });

//Create
books.post("/", authenticate, checkBoolean, checkAuthor, checkTitle , async (req, res) => {
    try {
      const { username } = req
      const bodyWithCapitalizedTitle = nameCap(req.body);
      const newBook = await createBook({added_by: username, ...bodyWithCapitalizedTitle});
  
      res.status(200).json(newBook);
    } catch (error) {
      res.status(500).json({ error: "error" });
    }
  });


//Delete
books.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const deletedBook = await deleteBook(id);
      if (deletedBook.id) {
        res.status(200).json(deletedBook);
      } else {
        res.status(404).json({ error: "Book not found" });
      }
    } catch (error) {
      return error;
    }
  });

//Update
books.put("/:id",  checkBoolean, checkAuthor, checkTitle ,async (req, res) => {
    try {
      const { id } = req.params;
      const updatedBook = await updateBook(id, req.body);
  
      if (updatedBook.id) {
        res.status(200).json(updatedBook);
      } else {
        res.status(404).json({ error: "Book not found" });
      }
    } catch (error) {
      res.status(404).json({ error: "id not found" });
    }
  });
  



module.exports = books;
