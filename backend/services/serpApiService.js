// Service responsible for fetching hotel data from SerpAPI (Google Hotels)
// and returning normalized hotel objects with a prices array for this source.

const axios = require("axios");
const { normalizeFromSerpApi } = require("../utils/normalizeHotel");
const { getSerpApiKey } = require("../config/apiKeys");

async function getSerpApiHotels(city) {
  const apiKey = getSerpApiKey();
  if (!apiKey) {
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

  // Wrap each normalized hotel into the target normalized format:
  // { name, location, rating, image, prices: [{ source, price, link }] }
  return properties.map((item) => {
    const base = normalizeFromSerpApi(item);
    return {
      name: base.name,
      location: base.location,
      rating: base.rating,
      image: base.image,
      prices: [
        {
          source: "Google Hotels",
          price: base.price,
          link: base.bookingUrl,
        },
      ],
    };
  });
}

module.exports = {
  getSerpApiHotels,
};

