const db = require("../db/dbConfig")


const getAllUsers = async () => {
    try {
        const allUsers = await db.any("SELECT * FROM users")
        return allUsers
    } catch (error) {
        return error
    }
}

const getOneUser = async (username) => {
    try {
        const oneUser = await db.one("SELECT * FROM users WHERE username=$1", username)
        console.log(oneUser)
        return oneUser
    } catch (error) {
        return error
    }
}

const createUser = async (username, password) => {
    try {
      const newUser = await db.one(
        "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *",
        [
          username,
          password
        ]
      );
      return newUser;
    } catch (error) {
      return error;
    }
  };

  //Delete
const deleteUser = async (username) => {
    try {
      const deletedUser = await db.one(
        "DELETE FROM users WHERE username=$1 RETURNING *",
        username
      );
      return deletedUser;
    } catch (error) {
      return error;
    }
  };
  




module.exports = { getAllUsers, createUser, getOneUser, deleteUser }