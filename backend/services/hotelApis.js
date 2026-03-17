const axios = require("axios");

// All normalized hotel results share this shape:
// {
//   name: string,
//   price: number,
//   rating: number,
//   image: string,
//   link: string,
//   platform: "Google" | "Booking" | "Airbnb"
// }

function toNumber(value) {
  if (value == null) return null;
  const n = Number(value);
  return Number.isNaN(n) ? null : n;
}

// Google Hotels via SerpAPI
async function getGoogleHotels(city) {
  const apiKey = process.env.SERP_API_KEY;
  if (!apiKey) {
    console.warn("SERP_API_KEY is not set");
    return [];
  }

  const url = "https://serpapi.com/search.json";
  const params = {
    engine: "google_hotels",
    q: city,
    api_key: apiKey,
  };

  const response = await axios.get(url, { params });
  const data = response.data || {};
  const properties = data.properties || data.hotels_results || [];

  return properties.map((item) => {
    const priceRaw =
      item.rate_per_night?.lowest ||
      item.rate_per_night ||
      item.rate ||
      item.price;

    return {
      name: item.name,
      price: toNumber(priceRaw),
      rating: toNumber(item.overall_rating || item.rating),
      image: (item.images && item.images[0]) || item.thumbnail || null,
      link: item.link || item.book_link || null,
      platform: "Google",
    };
  });
}

// Booking.com via RapidAPI
async function getBookingHotels(city) {
  const rapidKey = process.env.RAPIDAPI_KEY;
  if (!rapidKey) {
    console.warn("RAPIDAPI_KEY is not set for Booking.com");
    return [];
  }

  const url = "https://booking-com.p.rapidapi.com/v1/hotels/search";
  const headers = {
    "X-RapidAPI-Key": rapidKey,
    "X-RapidAPI-Host": "booking-com.p.rapidapi.com",
  };

  // In production you would resolve city -> dest_id; here we use name as a basic filter
  const params = {
    locale: "en-gb",
    units: "metric",
    order_by: "popularity",
    name: city,
    checkin_date: "2025-01-01",
    checkout_date: "2025-01-02",
    adults_number: 2,
    room_number: 1,
  };

  const response = await axios.get(url, { params, headers });
  const data = response.data || {};
  const results = data.result || data.hotels || [];

  return results.map((item) => {
    const priceRaw =
      item.min_total_price || item.price_breakdown?.gross_price || item.price;

    return {
      name: item.hotel_name || item.name,
      price: toNumber(priceRaw),
      rating: toNumber(item.review_score || item.reviewScore),
      image: item.main_photo_url || item.photo_url || null,
      link: item.url || null,
      platform: "Booking",
    };
  });
}

// Airbnb via RapidAPI
async function getAirbnbHotels(city) {
  const rapidKey = process.env.RAPIDAPI_KEY;
  if (!rapidKey) {
    console.warn("RAPIDAPI_KEY is not set for Airbnb");
    return [];
  }

  const url = "https://airbnb13.p.rapidapi.com/search-location";
  const headers = {
    "X-RapidAPI-Key": rapidKey,
    "X-RapidAPI-Host": "airbnb13.p.rapidapi.com",
  };

  const params = {
    location: city,
    adults: 2,
    page: 1,
    checkin: "2025-01-01",
    checkout: "2025-01-02",
    currency: "INR",
  };

  const response = await axios.get(url, { params, headers });
  const data = response.data || {};
  const results = data.results || data.listings || [];

  return results.map((item) => {
    const priceRaw = item.price?.rate || item.price;

    return {
      name: item.name || item.title,
      price: toNumber(priceRaw),
      rating: toNumber(item.rating || item.reviewScore),
      image: item.images?.[0] || item.thumbnail || null,
      link: item.url || null,
      platform: "Airbnb",
    };
  });
}

// Merge and group results from all platforms
async function getMergedHotelResults(city) {
  const results = await Promise.allSettled([
    getGoogleHotels(city),
    getBookingHotels(city),
    getAirbnbHotels(city),
  ]);

  const allOffers = [];

  results.forEach((result, index) => {
    if (result.status === "fulfilled") {
      allOffers.push(...(result.value || []));
    } else {
      const source =
        index === 0 ? "Google" : index === 1 ? "Booking" : "Airbnb";
      console.error(`Error fetching from ${source}:`, result.reason);
    }
  });

  if (allOffers.length === 0) {
    throw new Error("No hotel data available from any external provider");
  }

  const byName = new Map();

  for (const offer of allOffers) {
    if (!offer.name) continue;
    const key = offer.name.trim();
    if (!byName.has(key)) {
      byName.set(key, {
        name: key,
        rating: offer.rating ?? null,
        image: offer.image ?? null,
        prices: [],
      });
    }
    const entry = byName.get(key);

    entry.prices.push({
      platform: offer.platform,
      price: offer.price,
      link: offer.link,
    });

    if (entry.rating == null && offer.rating != null) {
      entry.rating = offer.rating;
    }
    if (!entry.image && offer.image) {
      entry.image = offer.image;
    }
  }

  return Array.from(byName.values());
}

module.exports = {
  getGoogleHotels,
  getBookingHotels,
  getAirbnbHotels,
  getMergedHotelResults,
};

