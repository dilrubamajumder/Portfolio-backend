//Dependencies(require)
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const booksController = require("./controllers/bookController.js");
const userController = require("./controllers/userController.js");

//Config
const app = express();

//Middleewar(use)
app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/users", userController);
app.use ("/books", booksController);

//Routes(get)
app.get("/", (req, res) => {
    res.send("Welcome to Book-Ex App, use `/books` route to get books data. To get Reviews, use `/books/{id}/reviews")
});

app.get("*", (req, res) => {
    res.status(404).json("Unable to find Page")
});

module.exports= app;
