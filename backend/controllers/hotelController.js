// Controller for hotel price comparison requests.
// Responsible for:
// - Reading the city from the query string
// - Checking the in-memory cache
// - Calling the hotelAggregator when needed
// - Storing results in cache
// - Formatting the HTTP response

const { aggregateHotelsForCity } = require("../services/hotelAggregator");
const { getFromCache, setCache } = require("../utils/cache");

async function getComparePrices(req, res) {
  const city = req.query.city;

  if (!city) {
    return res.status(400).json({ message: "city query parameter is required" });
  }

  try {
    // First, try to serve from cache to avoid repeated external API calls.
    const cached = getFromCache(city);
    if (cached) {
      return res.json(cached);
    }

    // Otherwise, call the aggregator to fetch/merge/sort results
    const hotels = await aggregateHotelsForCity(city);

    const responsePayload = {
      city,
      totalHotels: hotels.length,
      hotels,
    };

    // Store in cache for subsequent requests
    setCache(city, responsePayload);

    return res.json(responsePayload);
  } catch (error) {
    console.error("Error in getComparePrices controller:", error);
    return res.status(500).json({
      message: "Failed to compare hotel prices",
      error: error.message,
    });
  }
}

module.exports = {
  getComparePrices,
};

