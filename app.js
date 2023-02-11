//Dependencies(require)
const express = require("express");
const cors = require("cors");
const booksController = require("./controllers/bookController.js");

//Config
const app = express();

//Middleewar(use)
app.use(cors());
app.use(express.json());
app.use ("/books", booksController);

//Routes(get)
app.get("/", (req, res) => {
    res.send("Welcome to Book-Ex App, use `/books` route to get books data")
});

app.get("*", (req, res) => {
    res.status(404).json("Unable to find Page")
});

module.exports= app;
