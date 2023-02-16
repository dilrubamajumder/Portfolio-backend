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
// get user's information using their cookie
  users.get('/by-username', authenticate, async (req, res) => {
    const { username } = req;
    const user = await getOneUser(username);
    if (user) {
      res.status(200).json({ id: user.id, username: user.username })
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
      if (!user) {
        return res.status(401).send("User Does Not Exist.");
      }
  
      const isValidPassword = await bcrypt.compare(password, user.password);
  
      if (isValidPassword) {
        const token = jwt.sign({ username: user.username }, process.env.AUTH_KEY);
        console.log(user)
        res.status(200).json({
          user,
          message: 'Account Creation Successful',
          token
      });
      }
    } catch (err) {
        console.log(err.message)
      res.status(500).send(err);
    }
  });

  //delete user

  users.delete('/', authenticate, async (req, res) => {
    try {
      const actualUser = req.username
      const { username, password } = req.body;
      if (username !== actualUser) {
        throw Error("You can't delete someone else");
      }
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
