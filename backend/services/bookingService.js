// Service responsible for fetching hotel data from the Booking.com API (via RapidAPI)
// and returning normalized hotel objects.

const axios = require("axios");
const { normalizeFromBooking } = require("../utils/normalizeHotel");
const { getRapidApiKey } = require("../config/apiKeys");

async function getBookingHotels(city) {
  const rapidKey = getRapidApiKey();
  if (!rapidKey) {
    console.warn("RAPIDAPI_KEY is not set for Booking.com");
    return [];
  }

  const url = "https://booking-com.p.rapidapi.com/v1/hotels/search";
  const headers = {
    "X-RapidAPI-Key": rapidKey,
    "X-RapidAPI-Host": "booking-com.p.rapidapi.com",
  };

  // In production you would resolve city -> dest_id; here we use name as a basic filter.
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
    const base = normalizeFromBooking(item);
    return {
      name: base.name,
      location: base.location,
      rating: base.rating,
      image: base.image,
      prices: [
        {
          source: "Booking",
          price: base.price,
          link: base.bookingUrl,
        },
      ],
    };
  });
}

module.exports = {
  getBookingHotels,
};

