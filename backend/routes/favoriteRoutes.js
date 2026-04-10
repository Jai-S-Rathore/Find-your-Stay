const express = require("express");
const { getFavorites, toggleFavorite } = require("../controllers/favoriteController");

const router = express.Router();

router.get("/:userId", getFavorites);
router.post("/toggle", toggleFavorite);

module.exports = router;