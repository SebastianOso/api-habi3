const db = require("../../database");
const bcrypt = require("bcrypt");

const getAllUsers = async () => {
  const [rows] = await db.execute("SELECT * FROM user");
  return rows;
};


const getLoginUser = async (email, password) => {
  //Buscar usuario por correo
  const [rows] = await db.execute(
    "SELECT IDUser, Name, email, gender, dateOfBirth, coins, password FROM user WHERE email = ?",
    [email]
  );

  if (rows.length === 0) {
    throw new Error("Usuario no encontrado");
  }

  const user = rows[0];

  //Debug
  console.log("Password recibido:", password);
  console.log("Hash en DB:", user.password);

  //Comparar contraseñas con bcrypt
  const isMatch = await bcrypt.compare(password, user.password); // OJO: usar "user.password"

  if (!isMatch) {
    throw new Error("Contraseña incorrecta");
  }

  // 3. Retornar datos del usuario (sin contraseña)
  return {
    id: user.IDUser,
    name: user.Name,
    email: user.email,
    gender: user.gender,
    dateOfBirth: user.dateOfBirth,
    coins: user.coins
  };
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
