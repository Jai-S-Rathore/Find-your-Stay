const express = require("express");
const db = require("../db");

const router = express.Router();

// GET /api/stays
// Optional query param: ?city=Delhi to filter by city (case insensitive, partial match)
router.get("/", async (req, res) => {
  const city = (req.query.city || "").toString().trim();

  try {
    const params = [];
    let whereClause = "";

    if (city) {
      whereClause = "WHERE LOWER(s.city) LIKE LOWER(?)";
      params.push(`%${city}%`);
    }

    const [rows] = await db.query(
      `SELECT 
        s.id,
        s.name,
        s.city,
        s.type,
        s.address,
        s.latitude,
        s.longitude,
        s.host_email,
        s.host_phone,
        s.host_whatsapp,
        s.overall_rating,
        s.image_url,
        MIN(sp.price) AS price
      FROM stays s
      LEFT JOIN stay_prices sp
        ON s.id = sp.stay_id
      ${whereClause}
      GROUP BY s.id`,
      params
    );

    res.json(rows);
  } catch (error) {
    console.error("Error fetching stays:", error);
    res.status(500).json({
      message: "Failed to fetch stays",
      error: error.message,
    });
  }
});

module.exports = router;

