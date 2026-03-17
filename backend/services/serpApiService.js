const axios = require("axios");
const { normalizeFromSerpApi } = require("../utils/normalizeHotel");
const { getSerpApiKey } = require("../config/apiKeys");
 
async function getSerpApiHotels(city) {
  try {
    const apiKey = getSerpApiKey();
    if (!apiKey) {
      console.warn("⚠️  SerpAPI key missing — skipping Google Hotels");
      return [];
    }
 
    const url = "https://serpapi.com/search.json";
    const params = {
      engine: "google_hotels",
      q: `hotels in ${city}`,       // ✅ More specific query
      api_key: apiKey,
      currency: "INR",              // ✅ Indian Rupees
      gl: "in",                     // ✅ India region
      hl: "en",
    };
 
    const response = await axios.get(url, { params, timeout: 8000 }); // ✅ Timeout added
    const data = response.data || {};
    const properties = data.properties || data.hotels_results || [];
 
    if (!properties.length) {
      console.warn(`⚠️  SerpAPI returned 0 results for city: ${city}`);
      return [];
    }
 
    return properties
      .map((item) => {
        try {
          const base = normalizeFromSerpApi(item);
          return {
            name:     base.name,
            location: base.location,
            rating:   base.rating,
            image:    base.image || "/images/default-stay.jpg", // ✅ Fallback image
            prices: [
              {
                source: "Google Hotels",
                price:  base.price,
                link:   base.bookingUrl || "#",
              },
            ],
          };
        } catch (normalizeErr) {
          console.warn("⚠️  Failed to normalize SerpAPI item:", normalizeErr.message);
          return null; // skip bad item
        }
      })
      .filter(Boolean) // ✅ Remove any nulls from failed normalizations
      .filter((h) => h.prices[0].price); // ✅ Remove items with no price
      
  } catch (err) {
    // ✅ Graceful fallback — never crash the whole /compare-prices route
    if (err.response?.status === 401) {
      console.warn("❌ SerpAPI: Invalid API key");
    } else if (err.response?.status === 429) {
      console.warn("❌ SerpAPI: Rate limit exceeded");
    } else if (err.code === "ECONNABORTED") {
      console.warn("❌ SerpAPI: Request timed out");
    } else {
      console.warn("❌ SerpAPI failed:", err.message);
    }
    return []; // always return empty array so other APIs still work
  }
}
 
module.exports = { getSerpApiHotels };
 