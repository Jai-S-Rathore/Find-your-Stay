const express = require("express");
const { searchStays } = require("../controllers/searchController");

const router = express.Router();

// GET /api/search?query=...&userId=...
router.get("/", searchStays);

module.exports = router;