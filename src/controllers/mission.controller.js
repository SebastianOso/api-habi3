const missionService = require("../services/mission.service");

const getMissions = async (req, res) => {
  try {
    const mission = await missionService.getAllMissions();
    res.json(mission);
  } catch (err) {
    res.status(500).json({
      error: "Error al misiones",
      details: err.message,
    });
  }
};

module.exports = { getMissions };