const express = require("express");
const {
  getAllRecentReviews,
  getReviewsForStay,
  addReview,
} = require("../controllers/reviewController");

const router = express.Router();

router.get("/", getAllRecentReviews);
// GET /api/reviews/:stayId
router.get("/:stayId", getReviewsForStay);

// POST /api/reviews
router.post("/", addReview);

module.exports = router;

