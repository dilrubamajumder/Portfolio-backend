const express = require("express");
const users = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authenticate = require('./auth')
const {
    getAllUsers,
    createUser,
    getOneUser,
    deleteUser
  } = require("../queries/users");


  users.get('/', authenticate, async (req, res) => {
    const allUsers = await getAllUsers();
  if (allUsers[0]) {
    res.status(200).json(allUsers)
  }else{
    res.status(500).json({error: "server error"})
  }
  })
/**
 * Validates users registration credentials
 * @param {string} username - The user's chosen tagname
 * @param {string} password - The user's password (to be hashed client-side and server-side)
 */
 const validateInputs = (username, password) => {
    const usernameRegex = /\W/i;
    if (
      username.length < 3 ||
      username.length > 30 ||
      usernameRegex.test(username)
    ) {
      return false;
    }
    if (password.length < 8) return false;
    return true;
  };
  
  /**
   * Registers user's credentials, adding them to the database using the User model
   * @param {object} req - The request object containing users credentials
   * @param {object} res - The response object used to send a repsonse back to the client
   */
  users.post('/', async (req, res) => {
    try {
      const { username, password } = req.body;
      if (validateInputs(username, password) === false) throw Error("Invalid Credentials.");
      const saltRounds = 7;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      await createUser(username, hashedPassword);

      const token = jwt.sign({ username: username }, process.env.AUTH_KEY);
      res.cookie('token', token).sendStatus(200);
    } catch (err) {
      res.status(500).send(err);
    }
  });

//login function
  users.put('/', async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await getOneUser(username);
  console.log(user)
      if (!user) {
        return res.status(401).send("User Does Not Exist.");
      }
  
      const isValidPassword = await bcrypt.compare(password, user.password);
  
      if (isValidPassword) {
        const token = jwt.sign({ username: user.username }, process.env.AUTH_KEY);
        res.cookie("token", token).status(200).send(JSON.stringify(user));
      }
    } catch (err) {
        console.log(err.message)
      res.status(500).send(err);
    }
  });

//logout function
  users.get('/logout', (req, res) => {
    res.clearCookie("token").sendStatus(200);
  })

  //delete user

  users.delete('/', async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await getOneUser(username);
  
      if (user.username !== username) throw Error("Incorrect Credentials");
  
      const isValidPassword = await bcrypt.compare(password, user.password);
  
      if (isValidPassword) {
        deleteUser(username);
        return res.sendStatus(200);
      }
      res.sendStatus(401);
    } catch (err) {
      res.status(500).send(err);
    }
  })



  module.exports = users;