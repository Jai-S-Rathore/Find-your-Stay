const express = require("express");
const { logCall } = require("../controllers/callController");

const router = express.Router();

// POST /api/call-log
router.post("/", logCall);

module.exports = router;

