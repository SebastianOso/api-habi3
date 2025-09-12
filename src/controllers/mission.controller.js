const missionService = require("../services/mission.service");

const getMissions = async (req, res) => {
  try {
    const mission = await missionService.getAllMissions();
    res.json(users);
  } catch (err) {
    res.status(500).json({
      error: "Error al obtener usuarios",
      details: err.message,
    });
  }
};

module.exports = { getMissions };