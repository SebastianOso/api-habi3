const express = require("express");
const usersRoutes = require("./src/routes/users.routes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Rutas
app.use("/api/users", usersRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});