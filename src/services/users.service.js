const db = require("../../database");

const getAllUsers = async () => {
  const [rows] = await db.execute("SELECT * FROM user");
  return rows;
};

const getLoginUser = async (id) => {
  const [rows] = await db.execute("SELECT email, password FROM user WHERE IDUser =?", [id]);
  return rows;
};

const getStatsUser = async (id) => {
  const [rows] = await db.execute(
    `SELECT 
        u.IDUser,
        u.name,
        u.email,
        u.coins,
        t.level AS tree_level,
        r.league AS ranking_league
     FROM user u
     LEFT JOIN tree t ON u.IDUser = t.IDUser
     LEFT JOIN ranking r ON t.IDTree = r.IDTree
     WHERE u.IDUser = ?`,
    [id]
  );
  return rows;
};

const postSignupUser = async (name, email, gender, dateOfBirth, coins, password) => {
    try {
    // Insertar usuario
    const [result] = await db.execute(
      "INSERT INTO user (name, email, gender, dateOfBirth, coins, password, deleted) VALUES (?,?,?,?,?,?,?)",
      [name, email, gender, dateOfBirth, coins, password, 0]
    );

    const userId = result.insertId; // ID del usuario recién creado

    // Insertar en tree vinculado a ese usuario
    await db.execute(
      "INSERT INTO tree (IDUser, level) VALUES (?, ?)",
      [userId, 1] // Por defecto nivel 1
    );

    return { userId }; // Devuelve el ID del usuario creado
  } catch (err) {
    throw new Error(err.message);
  }
};

module.exports = { getAllUsers, getLoginUser, postSignupUser, getStatsUser };
