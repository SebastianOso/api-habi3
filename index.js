const express = require("express");
const usersRoutes = require("./src/routes/users.routes");
const db = require("./database"); // importamos el pool

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Endpoint para probar SHOW TABLES
app.get("/show-tables", async (req, res) => {
  try {
    const [users] = await db.execute("SELECT * FROM user");
    res.json({
      success: true,
      tables: users,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error al conectar o listar usuarios",
      error: err.message,
    });
  }
});

// Rutas de usuarios
app.use("/api/users", usersRoutes);

app.listen(PORT, () => {
  console.log(` Servidor corriendo en http://localhost:${PORT}`);
});