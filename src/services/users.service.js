const db = require("../../database");

const getAllUsers = async () => {
  const [rows] = await db.execute("SELECT * FROM user");
  return rows;
};

const getLoginUser = async (id) => {
  const [rows] = await db.execute("SELECT email, password FROM user WHERE IDUser =?", [id]);
  return rows;
};

module.exports = { getAllUsers, getLoginUser };
