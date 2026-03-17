// Route for the hotel price comparison aggregator.
// When the frontend calls GET /api/compare-prices?city=Delhi
// this route orchestrates calling all external providers, merging
// the results, and returning a clean JSON payload.

const express = require("express");
const { getSerpApiHotels } = require("../services/serpApiService");
const { getAmadeusHotels } = require("../services/amadeusService");
const { getBookingHotels } = require("../services/bookingService");
const { mergeHotels } = require("../services/mergeHotels");

const router = express.Router();

// GET /api/compare-prices?city=Delhi
router.get("/compare-prices", async (req, res) => {
  const city = req.query.city;

  if (!city) {
    return res.status(400).json({ message: "city query parameter is required" });
  }

  try {
    // Call all providers in parallel so that the user does not wait
    // for them sequentially. Promise.allSettled allows partial success.
    const results = await Promise.allSettled([
      getSerpApiHotels(city),
      getAmadeusHotels(city),
      getBookingHotels(city),
    ]);

    const allHotels = [];

    results.forEach((result, index) => {
      if (result.status === "fulfilled") {
        allHotels.push(...(result.value || []));
      } else {
        const source =
          index === 0 ? "SerpAPI" : index === 1 ? "Amadeus" : "Booking";
        console.error(`Error fetching hotels from ${source}:`, result.reason);
      }
    });

    const mergedHotels = mergeHotels([allHotels]);

    return res.json({
      city,
      totalResults: mergedHotels.length,
      hotels: mergedHotels,
    });
  } catch (error) {
    console.error("Error in /api/compare-prices:", error);
    res.status(500).json({
      message: "Failed to compare hotel prices",
      error: error.message,
    });
  }
});

module.exports = router;

