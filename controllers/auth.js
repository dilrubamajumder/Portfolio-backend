const jwt = require("jsonwebtoken");
const { getOneUser } = require('../queries/users')
require("dotenv").config();

/**
 * Verifies authenticity of user's JWT and attaches user to request object
 * @param {object} req - The request object containing users credentials
 * @param {object} res - The response object used to send a repsonse back to the client
 * @param {object} next - The next function used to pass the req to the next middleware function
 */
const authenticate = async (req, res, next) => {
  
  const token = req.headers.authorization;

  if (!token) return res.status(401).send("Token not found, please login.");

  const { username } = jwt.verify(req.headers.authorization.split(' ')[1], process.env.AUTH_KEY)

  const user = await getOneUser(username);

  if (!user) return res.status(404).send("No user found.");
  req.username = user.username;
  next();
};

module.exports = authenticate;