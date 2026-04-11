const db = require("../db");

// Toggle a favorite (Add if it doesn't exist, remove if it does)
async function toggleFavorite(req, res) {
  const { userId, stayId } = req.body;

  if (!userId || !stayId) {
    return res.status(400).json({ message: "User ID and Stay ID are required" });
  }

  try {
    // Check if it already exists
    const [existing] = await db.query(
      "SELECT * FROM favorites WHERE user_id = ? AND stay_id = ?",
      [userId, stayId]
    );

    if (existing.length > 0) {
      // It exists, so remove it (Unlike)
      await db.query("DELETE FROM favorites WHERE user_id = ? AND stay_id = ?", [userId, stayId]);
      return res.json({ message: "Removed from favorites", isFavorite: false });
    } else {
      // It doesn't exist, so add it (Like)
      await db.query("INSERT INTO favorites (user_id, stay_id) VALUES (?, ?)", [userId, stayId]);
      return res.json({ message: "Added to favorites", isFavorite: true });
    }
  } catch (error) {
    console.error("Error toggling favorite:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// Get just the IDs of favorites for the Heart Icons
async function getUserFavorites(req, res) {
  const { userId } = req.params;
  try {
    const [rows] = await db.query("SELECT stay_id FROM favorites WHERE user_id = ?", [userId]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
}

// Get the FULL stay details for the "My Favorites" Page
async function getUserFavoriteDetails(req, res) {
  const { userId } = req.params;
  try {
    // Join the favorites table with the stays table
    const [stays] = await db.query(
      `SELECT s.id, s.name as title, s.city as location, s.image_url as image, s.overall_rating as rating
       FROM favorites f
       JOIN stays s ON f.stay_id = s.id
       WHERE f.user_id = ?`,
      [userId]
    );

    res.json(stays);
  } catch (error) {
    console.error("Error fetching favorite details:", error);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = { toggleFavorite, getUserFavorites, getUserFavoriteDetails };