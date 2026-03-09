const express = require("express");
const { getAllStays, getStayById } = require("../controllers/stayController");

const router = express.Router();

// GET /api/stays
router.get("/", getAllStays);

// GET /api/stays/:id
router.get("/:id", getStayById);

module.exports = router;

