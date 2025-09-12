const db = require("../../database");

const getAllUsers = async () => {
  const [rows] = await db.execute("SELECT * FROM user");
  return rows;
};

const getLoginUser = async (id) => {
  const [rows] = await db.execute("SELECT email, password FROM user WHERE IDUser =?", [id]);
  return rows;
};

const postSignupUser = async (name, email, gender, dateOfBirth, coins, password) => {
  const [rows] = await db.execute("INSERT INTO user (name, email, gender, dateOfBirth, coins, password, deleted) VALUES (?,?,?,?,?,?,?)", [name, email, gender, dateOfBirth, coins, password, 0]);
  return rows;
};

module.exports = { getAllUsers, getLoginUser, postSignupUser };
