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

const getUserMission = async (req, res) => {
  try {
    const userMission = await missionService.getUserMission();
    res.json(userMission);
  } catch (err) {
    res.status(500).json({
      error: "Error al misisiones del usuario",
      details: err.message,
    });
  }
};


module.exports = { getMissions, getUserMission };