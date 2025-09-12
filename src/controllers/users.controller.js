const userService = require("../services/users.service");

const getUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({
      error: "Error al obtener usuarios",
      details: err.message,
    });
  }
};

const getLogin = async (req, res) => {
  try {
    const id = req.params.id; 
    const passkeys = await userService.getLoginUser(id);
    res.json(passkeys);
  } catch (err) {
    res.status(500).json({
      error: "Error al obtener usuarios",
      details: err.message,
    });
  }
};

module.exports = { getUsers, getLogin };