const express = require("express");
const usersRoutes = require("./src/routes/users.routes");
const db = require("./database"); // importamos el pool

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Endpoint para probar SHOW TABLES
app.get("/show-tables", async (req, res) => {
  try {
    const [tables] = await db.execute("SHOW TABLES");
    res.json({
      success: true,
      tables: tables.map(row => Object.values(row)[0]),
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error al conectar o listar tablas",
      error: err.message,
    });
  }
});

// Rutas de usuarios
app.use("/api/users", usersRoutes);

app.listen(PORT, () => {
  console.log(` Servidor corriendo en http://localhost:${PORT}`);
});