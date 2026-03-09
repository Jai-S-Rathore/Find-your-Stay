const axios = require("axios");

// Normalize external result into a common shape
function normalizeOffer({ name, price, rating, image, booking_link, source }) {
  return {
    name: name || "Unknown Hotel",
    price: typeof price === "number" ? price : null,
    rating: typeof rating === "number" ? rating : null,
    image: image || null,
    booking_link: booking_link || null,
    source,
  };
}

async function getGoogleHotelPrices(city) {
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

  return properties.map((item) =>
    normalizeOffer({
      name: item.name,
      price: item.rate_per_night?.lowest || item.rate_per_night || null,
      rating: item.overall_rating || item.rating || null,
      image: (item.images && item.images[0]) || item.thumbnail || null,
      booking_link: item.link || item.book_link || null,
      source: "Google Hotels",
    })
  );
}

async function getBookingPrices(city) {
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

  // NOTE: In a production app, you would typically resolve city -> dest_id first.
  const params = {
    locale: "en-gb",
    units: "metric",
    order_by: "popularity",
    // These parameters may need to be adapted to your account and API plan.
    // Here we just pass the city as a search filter.
    name: city,
    checkin_date: "2025-01-01",
    checkout_date: "2025-01-02",
    adults_number: 2,
    room_number: 1,
  };

  const response = await axios.get(url, { params, headers });
  const data = response.data || {};
  const results = data.result || data.hotels || [];

  return results.map((item) =>
    normalizeOffer({
      name: item.hotel_name || item.name,
      price: item.min_total_price || item.price_breakdown?.gross_price,
      rating: item.review_score || item.reviewScore,
      image: item.main_photo_url || item.photo_url,
      booking_link: item.url || null,
      source: "Booking.com",
    })
  );
}

async function getAirbnbPrices(city) {
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

  return results.map((item) =>
    normalizeOffer({
      name: item.name || item.title,
      price: item.price?.rate || item.price,
      rating: item.rating || item.reviewScore,
      image: item.images?.[0] || item.thumbnail || null,
      booking_link: item.url || null,
      source: "Airbnb",
    })
  );
}

module.exports = {
  getGoogleHotelPrices,
  getBookingPrices,
  getAirbnbPrices,
};

