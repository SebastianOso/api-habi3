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


const getUserMissions = async (req, res) => {
  try {
    const { id } = req.params; // ← ahora sacamos el ID de la URL
    const userMission = await missionService.getUserMissions(id);

    res.json({
      success: true,
      userId: id,
      missions: userMission
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error al obtener misiones del usuario",
      details: err.message,
    });
  }
};

const postCompleteMission = async (req, res) => {
  try {
    const { IDMission, IDUser } = req.body;
    const result = await missionService.postCompleteMissionUser(IDUser, IDMission);
    res.json(result);
  } catch (err) {
    res.status(500).json({
      error: "Error al completar la misión",
      details: err.message,
    });
  }
};


module.exports = { getMissions, getUserMission, postCompleteMission, getUserMissions};