const db = require("../../database");

const getAllUsers = async () => {
  const [rows] = await db.execute("SELECT * FROM usuarios");
  return rows;
};

module.exports = { getAllUsers };
