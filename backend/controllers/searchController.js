const db = require("../db");
const {
  getUserCallCounts,
  maskPhoneForStays,
} = require("../utils/callLimit");

// GET /api/search?query=...&userId=...
async function searchStays(req, res) {
  const term = (req.query.query || req.query.q || "").trim();
  const userId = req.query.userId ? Number(req.query.userId) : null;

  if (!term) {
    return res.status(400).json({
      message: "Search query is required (use ?query= or ?q=)",
    });
  }

  try {
    const likeTerm = `%${term}%`;

    const [stays] = await db.query(
      `SELECT id, name, city, address, description, overall_rating, host_email, host_phone, host_whatsapp
       FROM stays
       WHERE name LIKE ? OR city LIKE ?`,
      [likeTerm, likeTerm]
    );

    const hasUser = Boolean(userId);
    const callCounts = hasUser ? await getUserCallCounts(userId) : {};
    const result = maskPhoneForStays(stays, callCounts, hasUser);

    res.json(result);
  } catch (error) {
    console.error("Error searching stays:", error);
    res.status(500).json({
      message: "Failed to search stays",
      error: error.message,
    });
  }
}

module.exports = {
  searchStays,
};

