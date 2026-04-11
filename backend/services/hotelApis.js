const axios = require("axios");
const db = require("./db"); // ✅ DB fallback when all APIs fail

function toNumber(value) {
  if (value == null) return null;
  const n = Number(value);
  return Number.isNaN(n) ? null : n;
}

// ✅ Always use tomorrow/day-after so APIs don't reject stale dates
function getCheckinDate() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
}
function getCheckoutDate() {
  const d = new Date();
  d.setDate(d.getDate() + 2);
  return d.toISOString().split("T")[0];
}

// ─────────────────────────────────────────
// Google Hotels via SerpAPI
// ─────────────────────────────────────────
async function getGoogleHotels(city) {
  const apiKey = process.env.SERP_API_KEY;
  if (!apiKey) {
    console.warn("⚠️  SERP_API_KEY not set — skipping Google Hotels");
    return [];
  }
  try {
    const response = await axios.get("https://serpapi.com/search.json", {
      params: {
        engine:   "google_hotels",
        q:        `hotels in ${city}`,
        api_key:  apiKey,
        currency: "INR",
        gl:       "in",
        hl:       "en",
      },
      timeout: 8000,
    });

    const properties =
      response.data?.properties || response.data?.hotels_results || [];

    if (!properties.length) {
      console.warn(`⚠️  Google Hotels: 0 results for "${city}"`);
      return [];
    }

    return properties
      .map((item) => ({
        name:     item.name || null,
        price:    toNumber(item.rate_per_night?.lowest || item.rate_per_night || item.rate || item.price),
        rating:   toNumber(item.overall_rating || item.rating),
        image:    item.images?.[0]?.thumbnail || item.thumbnail || "/images/default-stay.jpg",
        link:     item.link || item.book_link || "#",
        platform: "Google",
      }))
      .filter((h) => h.name && h.price);

  } catch (err) {
    if (err.response?.status === 401)      console.warn("❌ Google Hotels: Invalid API key");
    else if (err.response?.status === 429) console.warn("❌ Google Hotels: Rate limit hit");
    else if (err.code === "ECONNABORTED")  console.warn("❌ Google Hotels: Timed out");
    else                                   console.warn("❌ Google Hotels failed:", err.message);
    return [];
  }
}

// ─────────────────────────────────────────
// Booking.com via RapidAPI
// ─────────────────────────────────────────
async function getBookingHotels(city) {
  const rapidKey = process.env.RAPIDAPI_KEY;
  if (!rapidKey) {
    console.warn("⚠️  RAPIDAPI_KEY not set — skipping Booking.com");
    return [];
  }
  try {
    const response = await axios.get(
      "https://booking-com.p.rapidapi.com/v1/hotels/search",
      {
        params: {
          locale:             "en-gb",
          units:              "metric",
          order_by:           "popularity",
          dest_type:          "city",
          search_by_city:     city,
          checkin_date:       getCheckinDate(),
          checkout_date:      getCheckoutDate(),
          adults_number:      2,
          room_number:        1,
          filter_by_currency: "INR",
        },
        headers: {
          "X-RapidAPI-Key":  rapidKey,
          "X-RapidAPI-Host": "booking-com.p.rapidapi.com",
        },
        timeout: 8000,
      }
    );

    const results = response.data?.result || response.data?.hotels || [];
    if (!results.length) {
      console.warn(`⚠️  Booking.com: 0 results for "${city}"`);
      return [];
    }

    return results
      .map((item) => ({
        name:     item.hotel_name || item.name || null,
        price:    toNumber(item.min_total_price || item.price_breakdown?.gross_price || item.price),
        rating:   toNumber(item.review_score || item.reviewScore),
        image:    item.main_photo_url || item.photo_url || "/images/default-stay.jpg",
        link:     item.url ? `https://www.booking.com${item.url}` : "#",
        platform: "Booking",
      }))
      .filter((h) => h.name && h.price);

  } catch (err) {
    if (err.response?.status === 401 || err.response?.status === 403)
      console.warn("❌ Booking.com: Invalid RapidAPI key");
    else if (err.response?.status === 429) console.warn("❌ Booking.com: Rate limit hit");
    else if (err.code === "ECONNABORTED")  console.warn("❌ Booking.com: Timed out");
    else                                   console.warn("❌ Booking.com failed:", err.message);
    return [];
  }
}

// ─────────────────────────────────────────
// Airbnb via RapidAPI
// ─────────────────────────────────────────
async function getAirbnbHotels(city) {
  const rapidKey = process.env.RAPIDAPI_KEY;
  if (!rapidKey) {
    console.warn("⚠️  RAPIDAPI_KEY not set — skipping Airbnb");
    return [];
  }
  try {
    const response = await axios.get(
      "https://airbnb13.p.rapidapi.com/search-location",
      {
        params: {
          location: city,
          adults:   2,
          page:     1,
          checkin:  getCheckinDate(),
          checkout: getCheckoutDate(),
          currency: "INR",
        },
        headers: {
          "X-RapidAPI-Key":  rapidKey,
          "X-RapidAPI-Host": "airbnb13.p.rapidapi.com",
        },
        timeout: 8000,
      }
    );

    const results = response.data?.results || response.data?.listings || [];
    if (!results.length) {
      console.warn(`⚠️  Airbnb: 0 results for "${city}"`);
      return [];
    }

    return results
      .map((item) => ({
        name:     item.name || item.title || null,
        price:    toNumber(item.price?.rate || item.price),
        rating:   toNumber(item.rating || item.reviewScore),
        image:    item.images?.[0] || item.thumbnail || "/images/default-stay.jpg",
        link:     item.url || (item.id ? `https://www.airbnb.com/rooms/${item.id}` : "#"),
        platform: "Airbnb",
      }))
      .filter((h) => h.name && h.price);

  } catch (err) {
    if (err.response?.status === 401 || err.response?.status === 403)
      console.warn("❌ Airbnb: Invalid RapidAPI key");
    else if (err.response?.status === 429) console.warn("❌ Airbnb: Rate limit hit");
    else if (err.code === "ECONNABORTED")  console.warn("❌ Airbnb: Timed out");
    else                                   console.warn("❌ Airbnb failed:", err.message);
    return [];
  }
}

// ─────────────────────────────────────────
// ✅ MySQL DB Fallback
// ─────────────────────────────────────────
async function getDbHotels(city) {
  try {
    const [rows] = await db.query(
      `SELECT s.name, s.overall_rating AS rating, s.image_url AS image,
              sp.platform, sp.price, sp.link
       FROM stays s
       JOIN stay_prices sp ON s.id = sp.stay_id
       WHERE LOWER(s.city) = LOWER(?)`,
      [city]
    );
    return rows
      .map((row) => ({
        name:     row.name,
        price:    toNumber(row.price),
        rating:   toNumber(row.rating),
        image:    row.image || "/images/default-stay.jpg",
        link:     row.link || "#",
        platform: row.platform,
      }))
      .filter((h) => h.name && h.price);
  } catch (err) {
    console.warn("❌ DB fallback failed:", err.message);
    return [];
  }
}

// ─────────────────────────────────────────
// Merge all 4 sources into one clean list
// ─────────────────────────────────────────
async function getMergedHotelResults(city) {
  const [googleResult, bookingResult, airbnbResult, dbResult] =
    await Promise.allSettled([
      getGoogleHotels(city),
      getBookingHotels(city),
      getAirbnbHotels(city),
      getDbHotels(city),
    ]);

  const allOffers = [];
  const sources   = { Google: 0, Booking: 0, Airbnb: 0, DB: 0 };

  [
    { result: googleResult,  label: "Google"  },
    { result: bookingResult, label: "Booking" },
    { result: airbnbResult,  label: "Airbnb"  },
    { result: dbResult,      label: "DB"      },
  ].forEach(({ result, label }) => {
    if (result.status === "fulfilled" && result.value?.length) {
      allOffers.push(...result.value);
      sources[label] = result.value.length;
    } else if (result.status === "rejected") {
      console.error(`❌ ${label} fetch rejected:`, result.reason?.message);
    }
  });

  console.log(
    `📊 Sources — Google: ${sources.Google} | Booking: ${sources.Booking} | Airbnb: ${sources.Airbnb} | DB: ${sources.DB}`
  );

  if (allOffers.length === 0) {
    throw new Error("No hotel data available from any source");
  }

  // Group by name (case-insensitive)
  const byName = new Map();

  for (const offer of allOffers) {
    if (!offer.name) continue;
    const key = offer.name.trim().toLowerCase();

    if (!byName.has(key)) {
      byName.set(key, {
        name:   offer.name.trim(),
        rating: offer.rating ?? null,
        image:  offer.image || "/images/default-stay.jpg",
        prices: [],
      });
    }

    const entry = byName.get(key);

    // No duplicate platforms
    if (!entry.prices.some((p) => p.platform === offer.platform)) {
      entry.prices.push({ platform: offer.platform, price: offer.price, link: offer.link });
    }
    if (entry.rating == null && offer.rating != null) entry.rating = offer.rating;
    if ((!entry.image || entry.image === "/images/default-stay.jpg") &&
        offer.image && offer.image !== "/images/default-stay.jpg") {
      entry.image = offer.image;
    }
  }

  return Array.from(byName.values())
    .map((hotel) => ({
      ...hotel,
      prices:       hotel.prices.sort((a, b) => a.price - b.price),
      lowest_price: Math.min(...hotel.prices.map((p) => p.price)),
    }))
    .sort((a, b) => a.lowest_price - b.lowest_price);
}

module.exports = {
  getGoogleHotels,
  getBookingHotels,
  getAirbnbHotels,
  getMergedHotelResults,
};