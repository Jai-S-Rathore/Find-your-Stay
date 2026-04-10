const db = require("../db");

// GET /api/reviews/:stayId
// NEW: GET /api/reviews (Fetches all recent reviews for the homepage)
async function getAllRecentReviews(req, res) {
  try {
    const [reviews] = await db.query(`
      SELECT r.id, r.rating, r.comment, r.created_at, 
             COALESCE(u.name, 'Anonymous') AS user_name,
             s.name AS property_name, s.type AS stay_type
      FROM reviews r
      LEFT JOIN users u ON r.user_id = u.id
      LEFT JOIN stays s ON r.stay_id = s.id
      ORDER BY r.created_at DESC
      LIMIT 20
    `);
    res.json(reviews);
  } catch (error) {
    console.error("Error fetching all reviews:", error);
    res.status(500).json({ message: "Failed to fetch reviews" });
  }
}
async function getReviewsForStay(req, res) {
  const { stayId } = req.params;

  try {
    const [reviews] = await db.query(
      `SELECT r.id, r.rating, r.comment, r.created_at, u.name AS user_name
       FROM reviews r
       LEFT JOIN users u ON r.user_id = u.id
       WHERE r.stay_id = ?
       ORDER BY r.created_at DESC`,
      [stayId]
    );

    res.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews for stay:", error);
    res.status(500).json({
      message: "Failed to fetch reviews for the stay",
      error: error.message,
    });
  }
}

// POST /api/reviews
async function addReview(req, res) {
  const { stayId, userId, rating, comment } = req.body;

  if (!stayId || !userId || rating === undefined) {
    return res.status(400).json({
      message: "stayId, userId and rating are required",
    });
  }

  const numericRating = Number(rating);
  if (Number.isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
    return res.status(400).json({
      message: "rating must be a number between 1 and 5",
    });
  }

  try {
    const [result] = await db.query(
      "INSERT INTO reviews (stay_id, user_id, rating, comment, created_at) VALUES (?, ?, ?, ?, NOW())",
      [stayId, userId, numericRating, comment || null]
    );

    res.status(201).json({
      message: "Review added successfully",
      reviewId: result.insertId,
    });
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({
      message: "Failed to add review",
      error: error.message,
    });
  }
}

module.exports = {
  getAllRecentReviews,
  getReviewsForStay,
  addReview,
};

