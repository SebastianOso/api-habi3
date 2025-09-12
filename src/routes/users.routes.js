const express = require("express");
const router = express.Router();
const { getUsers } = require("../controllers/users.controller");
const { getLogin } = require("../controllers/users.controller");

// GET /api/users
router.get("/", getUsers);
router.get("/login/:id", getLogin);

module.exports = router;