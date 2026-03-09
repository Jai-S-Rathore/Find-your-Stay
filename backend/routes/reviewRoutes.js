const express = require("express");
const {
  getReviewsForStay,
  addReview,
} = require("../controllers/reviewController");

const router = express.Router();

// GET /api/reviews/:stayId
router.get("/:stayId", getReviewsForStay);

// POST /api/reviews
router.post("/", addReview);

module.exports = router;

