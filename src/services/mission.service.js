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

module.exports = { getAllMissions };
