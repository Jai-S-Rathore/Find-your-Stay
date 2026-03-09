const express = require("express");
const db = require("../db");
const {
  getGoogleHotelPrices,
  getBookingPrices,
  getAirbnbPrices,
} = require("../services/hotelApis");

const router = express.Router();

// Group normalized offers into aggregated hotel objects
function aggregateOffers(offers) {
  const byName = new Map();

  for (const offer of offers) {
    if (!offer.name) continue;
    const key = offer.name.trim();
    if (!byName.has(key)) {
      byName.set(key, {
        name: key,
        prices: [],
        rating: offer.rating || null,
        image: offer.image || null,
      });
    }
    const entry = byName.get(key);
    entry.prices.push({
      platform: offer.source,
      price: offer.price,
      booking_link: offer.booking_link,
    });
    if (!entry.rating && offer.rating) {
      entry.rating = offer.rating;
    }
    if (!entry.image && offer.image) {
      entry.image = offer.image;
    }
  }

  return Array.from(byName.values());
}

// GET /api/compare-prices?city=Delhi
router.get("/", async (req, res) => {
  const city = req.query.city;

  if (!city) {
    return res.status(400).json({ message: "city query parameter is required" });
  }

  try {
    // Try cache first (optional)
    const [cacheRows] = await db.query(
      `SELECT hotel_name, platform, price, city, created_at
       FROM hotel_prices_cache
       WHERE city = ?
         AND created_at >= DATE_SUB(NOW(), INTERVAL 1 HOUR)`,
      [city]
    );

    if (cacheRows.length > 0) {
      const offersFromCache = cacheRows.map((row) => ({
        name: row.hotel_name,
        price: Number(row.price),
        rating: null,
        image: null,
        booking_link: null,
        source: row.platform,
      }));

      return res.json(aggregateOffers(offersFromCache));
    }

    // No fresh cache: call external APIs in parallel
    const results = await Promise.allSettled([
      getGoogleHotelPrices(city),
      getBookingPrices(city),
      getAirbnbPrices(city),
    ]);

    const allOffers = [];

    results.forEach((result, index) => {
      if (result.status === "fulfilled") {
        allOffers.push(...(result.value || []));
      } else {
        const source =
          index === 0 ? "Google Hotels" : index === 1 ? "Booking.com" : "Airbnb";
        console.error(`Error fetching from ${source}:`, result.reason);
      }
    });

    if (allOffers.length === 0) {
      return res.status(502).json({
        message: "Failed to fetch prices from external providers",
      });
    }

    // Save to cache table (best-effort)
    try {
      if (allOffers.length > 0) {
        const values = allOffers.map((offer) => [
          offer.name,
          offer.source,
          offer.price,
          city,
        ]);

        await db.query(
          `INSERT INTO hotel_prices_cache (hotel_name, platform, price, city, created_at)
           VALUES ?`,
          [values]
        );
      }
    } catch (cacheError) {
      console.error("Error writing to hotel_prices_cache:", cacheError);
    }

    const aggregated = aggregateOffers(allOffers);
    res.json(aggregated);
  } catch (error) {
    console.error("Error in /api/compare-prices:", error);
    res.status(500).json({
      message: "Failed to compare hotel prices",
      error: error.message,
    });
  }
});

module.exports = router;

