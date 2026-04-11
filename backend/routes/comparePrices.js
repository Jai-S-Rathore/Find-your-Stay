const express = require("express");
const { getSerpApiHotels }  = require("../services/serpApiService");
const { getAmadeusHotels }  = require("../services/amadeusService");
const { getBookingHotels }  = require("../services/bookingService");
const { mergeHotels }       = require("../services/mergeHotels");
const db = require("../db");

const router = express.Router();

// GET /api/compare-prices?city=Delhi
router.get("/", async (req, res) => {
  const city = req.query.city;
  if (!city) {
    return res.status(400).json({ message: "city query parameter is required" });
  }

  try {
    // Fetch all sources in parallel
    const results = await Promise.allSettled([
      getSerpApiHotels(city),
      getAmadeusHotels(city),
      getBookingHotels(city),
      db.query(
        `SELECT s.name, s.overall_rating, s.image_url,
                sp.platform, sp.price, sp.link
         FROM stays s
         LEFT JOIN stay_prices sp ON s.id = sp.stay_id
         WHERE LOWER(s.city) = LOWER(?)`,
        [city]
      ),
    ]);

    const allHotels = [];

    // ✅ External API results (indexes 0, 1, 2)
    results.slice(0, 3).forEach((result, index) => {
      if (result.status === "fulfilled") {
        allHotels.push(...(result.value || []));
      } else {
        const source = index === 0 ? "SerpAPI" : index === 1 ? "Amadeus" : "Booking";
        console.warn(`⚠️  ${source} failed:`, result.reason?.message);
      }
    });

    // ✅ DB results (index 3) — structured same as API results
    if (results[3].status === "fulfilled") {
      const [dbRows] = results[3].value;

      // Group DB rows by hotel name first (LEFT JOIN gives one row per price)
      const dbMap = {};
      dbRows.forEach((row) => {
        if (!dbMap[row.name]) {
          dbMap[row.name] = {
            name:   row.name,
            rating: row.overall_rating,
            image:  row.image_url || "/images/default-stay.jpg",
            prices: [],
          };
        }
        if (row.platform && row.price) {
          dbMap[row.name].prices.push({
            platform: row.platform,
            price:    row.price,
            link:     row.link || "#",
          });
        }
      });

      allHotels.push(...Object.values(dbMap));
    } else {
      console.warn("⚠️  DB query failed:", results[3].reason?.message);
    }

    // ✅ BUG FIX: was mergeHotels([allHotels]) — wrong! array wrapped in array
    const mergedHotels = mergeHotels(allHotels);

    // ✅ Add lowest_price to each hotel for easy frontend sorting
    const hotelsWithLowest = mergedHotels.map((hotel) => ({
      ...hotel,
      lowest_price: hotel.prices?.length
        ? Math.min(...hotel.prices.map((p) => p.price).filter(Boolean))
        : null,
    }));

    return res.json({
      city,
      totalResults: hotelsWithLowest.length,
      hotels:       hotelsWithLowest,
    });

  } catch (error) {
    console.error("❌ Error in /api/compare-prices:", error);
    res.status(500).json({
      message: "Failed to compare hotel prices",
      error:   error.message,
    });
  }
});

module.exports = router;