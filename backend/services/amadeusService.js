// Service responsible for fetching hotel data from the Amadeus Hotels API
// and returning normalized hotel objects.
//
// NOTE: Amadeus uses OAuth2 client-credentials. This implementation obtains
// an access token and then performs a basic hotel-offers search. You may need
// to adjust query parameters (e.g. cityCode) to match your account and use case.

const axios = require("axios");
const { normalizeFromAmadeus } = require("../utils/normalizeHotel");
const { getAmadeusApiKey, getAmadeusSecret } = require("../config/apiKeys");

async function getAmadeusAccessToken() {
  const apiKey = getAmadeusApiKey();
  const apiSecret = getAmadeusSecret();

  if (!apiKey || !apiSecret) {
    console.warn("AMADEUS_API_KEY or AMADEUS_SECRET is not set");
    return null;
  }

  const tokenUrl = "https://test.api.amadeus.com/v1/security/oauth2/token";

  const params = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: apiKey,
    client_secret: apiSecret,
  });

  const response = await axios.post(tokenUrl, params.toString(), {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  return response.data?.access_token || null;
}

async function getAmadeusHotels(city) {
  const token = await getAmadeusAccessToken();
  if (!token) {
    return [];
  }

  // In a real setup, you would map city name -> cityCode.
  // Here we use a simple heuristic as a placeholder.
  const cityCode = city.slice(0, 3).toUpperCase();

  const url = "https://test.api.amadeus.com/v1/shopping/hotel-offers";

  const response = await axios.get(url, {
    params: {
      cityCode,
      adults: 2,
      roomQuantity: 1,
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = response.data || {};
  const offers = data.data || [];

  // Map raw offers into normalized hotel objects with a prices array
  return offers.map((offer) => {
    const base = normalizeFromAmadeus(offer);
    return {
      name: base.name,
      location: base.location,
      rating: base.rating,
      image: base.image,
      prices: [
        {
          source: "Amadeus",
          price: base.price,
          link: base.bookingUrl,
        },
      ],
    };
  });
}

module.exports = {
  getAmadeusHotels,
};

