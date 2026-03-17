// High-level service that orchestrates:
// - Calling each provider-specific service
// - Normalizing data (each service already returns normalized hotels)
// - Merging and deduplicating hotels
// - Aggregating prices per hotel
// - Sorting by lowest available price
//
// This service does NOT handle caching or HTTP concerns; those are handled
// in the controller layer.

const { getSerpApiHotels } = require("./serpApiService");
const { getAmadeusHotels } = require("./amadeusService");
const { getBookingHotels } = require("./bookingService");
const { deduplicateHotels } = require("../utils/deduplicateHotels");

function getLowestPrice(hotel) {
  if (!Array.isArray(hotel.prices) || hotel.prices.length === 0) {
    return Number.POSITIVE_INFINITY;
  }
  return hotel.prices.reduce((min, p) => {
    const price = typeof p.price === "number" ? p.price : Number.POSITIVE_INFINITY;
    return price < min ? price : min;
  }, Number.POSITIVE_INFINITY);
}

async function aggregateHotelsForCity(city) {
  // Call all API services in parallel. Using Promise.allSettled means a failure
  // in one provider won't prevent data from the others from being used.
  const results = await Promise.allSettled([
    getSerpApiHotels(city),
    getAmadeusHotels(city),
    getBookingHotels(city),
  ]);

  const allHotels = [];

  results.forEach((result, index) => {
    if (result.status === "fulfilled") {
      const hotels = result.value || [];
      allHotels.push(...hotels);
    } else {
      const source =
        index === 0 ? "SerpAPI" : index === 1 ? "Amadeus" : "Booking";
      console.error(`Error fetching hotels from ${source}:`, result.reason);
    }
  });

  if (allHotels.length === 0) {
    return [];
  }

  // Deduplicate by (name + location) and merge prices arrays
  const deduped = deduplicateHotels(allHotels);

  // Sort by lowest available price
  deduped.sort((a, b) => getLowestPrice(a) - getLowestPrice(b));

  return deduped;
}

module.exports = {
  aggregateHotelsForCity,
};

