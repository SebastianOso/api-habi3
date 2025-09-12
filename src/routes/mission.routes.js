const express = require("express");
const router = express.Router();
const { getMissions } = require("../controllers/mission.controller");

// GET /api/users
router.get("/", getMissions);

module.exports = router;