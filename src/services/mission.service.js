const db = require("../../database");

const getAllMissions = async () => {
  const [rows] = await db.execute(`
    SELECT m.IDMission,
       m.category,
       m.description AS missionDescription,
       m.experience,
       r.IDReward,
       r.name AS rewardName,
       r.description AS rewardDescription,
       r.type AS rewardType,
       r.value AS rewardValue
FROM mission m
LEFT JOIN missionRewards mr ON m.IDMission = mr.IDMission
LEFT JOIN rewards r ON mr.IDReward = r.IDReward;
`);
  return rows;
};

const getUserMission = async() => {
    const [rows] = await db.execute(`
SELECT 
    u.IDUser,
    u.name AS userName,
    m.IDMission,
    m.category AS missionCategory,
    m.description AS missionDescription,
    m.experience AS missionExperience,
    r.IDReward,
    r.name AS rewardName,
    r.type AS rewardType,
    r.value AS rewardValue,
    e.IDEvidence,
    e.dateOfSubmission,
    e.validation AS evidenceValidated,
    n.IDNotification,
    n.description AS notificationDescription
FROM userMission um
JOIN user u ON um.IDUser = u.IDUser
JOIN mission m ON um.IDMission = m.IDMission
JOIN evidence e ON um.IDEvidence = e.IDEvidence
JOIN notification n ON um.IDNotification = n.IDNotification
LEFT JOIN missionRewards mr ON m.IDMission = mr.IDMission
LEFT JOIN rewards r ON mr.IDReward = r.IDReward;
`);
    return rows; 
};

const getUserMissions = async (userId) => {
  const [rows] = await db.execute(
    `
    SELECT 
        u.IDUser,
        u.name AS userName,
        m.IDMission,
        m.category AS missionCategory,
        m.description AS missionDescription,
        m.experience AS missionExperience,
        r.IDReward,
        r.name AS rewardName,
        r.type AS rewardType,
        r.value AS rewardValue,
        e.IDEvidence,
        e.dateOfSubmission,
        e.validation AS evidenceValidated,
        n.IDNotification,
        n.description AS notificationDescription
    FROM userMission um
    JOIN user u ON um.IDUser = u.IDUser
    JOIN mission m ON um.IDMission = m.IDMission
    JOIN evidence e ON um.IDEvidence = e.IDEvidence
    JOIN notification n ON um.IDNotification = n.IDNotification
    LEFT JOIN missionRewards mr ON m.IDMission = mr.IDMission
    LEFT JOIN rewards r ON mr.IDReward = r.IDReward
    WHERE u.IDUser = ?;
    `,
    [userId]
  );
  return rows;
};

const postCompleteMissionUser = async (IDUser, IDMission) => {
  // 1. Actualizar evidencia
  await db.execute(
    "UPDATE evidence e JOIN userMission um ON e.IDEvidence = um.IDEvidence SET e.validation = 1 WHERE um.IDUser = ? AND um.IDMission = ?",
    [IDUser, IDMission]
  );

  // 2. Buscar experiencia de la misión
  const [mission] = await db.execute(
    "SELECT experience FROM mission WHERE IDMission = ?",
    [IDMission]
  );

  // 5. Actualizar experiencia del árbol del usuario
  await db.execute(
    "UPDATE tree SET level = level + ? WHERE IDUser = ?",
    [mission[0].experience, IDUser]
  );

  return { message: "Misión completada y recompensas aplicadas." };
};


module.exports = { getAllMissions,getUserMission, postCompleteMissionUser, getUserMissions };


