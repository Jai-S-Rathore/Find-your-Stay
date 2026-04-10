const db = require("../db");

// GET /api/favorites/:userId
async function getFavorites(req, res) {
  const { userId } = req.params;
  try {
    const [rows] = await db.query(
      "SELECT stay_id FROM favorites WHERE user_id = ?",
      [userId]
    );
    // Return an array of just the stay IDs
    res.json(rows.map(row => row.stay_id));
  } catch (error) {
    console.error("Error fetching favorites:", error);
    res.status(500).json({ message: "Failed to fetch favorites", error: error.message });
  }
}

// POST /api/favorites/toggle
async function toggleFavorite(req, res) {
  const { userId, stayId } = req.body;

  if (!userId || !stayId) {
    return res.status(400).json({ message: "userId and stayId are required" });
  }

  try {
    // Check if it's already favorited
    const [existing] = await db.query(
      "SELECT * FROM favorites WHERE user_id = ? AND stay_id = ?",
      [userId, stayId]
    );

    if (existing.length > 0) {
      // Remove it
      await db.query("DELETE FROM favorites WHERE user_id = ? AND stay_id = ?", [userId, stayId]);
      return res.json({ message: "Removed from favorites", isFavorite: false });
    } else {
      // Add it
      await db.query("INSERT INTO favorites (user_id, stay_id) VALUES (?, ?)", [userId, stayId]);
      return res.status(201).json({ message: "Added to favorites", isFavorite: true });
    }
  } catch (error) {
    console.error("Error toggling favorite:", error);
    res.status(500).json({ message: "Failed to toggle favorite", error: error.message });
  }
}

module.exports = {
  getFavorites,
  toggleFavorite,
};