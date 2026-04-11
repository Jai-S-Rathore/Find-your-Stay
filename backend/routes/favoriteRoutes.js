const express = require("express");
const router = express.Router();

// Import the exact function names from the controller
const { 
  toggleFavorite, 
  getUserFavorites, 
  getUserFavoriteDetails 
} = require("../controllers/favoriteController");

// Define the routes (Note: we don't need '/api/favorites' here because server.js handles that base path)
router.post("/", toggleFavorite);
router.get("/:userId", getUserFavorites);
router.get("/:userId/details", getUserFavoriteDetails);

module.exports = router;