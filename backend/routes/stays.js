const express = require("express");
const db = require("../db");

const router = express.Router();

// GET /api/stays
router.get("/", async (req, res) => {
  try {
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
      GROUP BY s.id`
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

