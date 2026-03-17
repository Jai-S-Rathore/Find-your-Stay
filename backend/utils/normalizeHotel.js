// Utility helpers to normalize different provider responses
// into a single common hotel shape used by the aggregator.
//
// Normalized format:
// {
//   name: string,
//   price: number | null,
//   rating: number | null,
//   image: string | null,
//   location: string | null,
//   source: string,
//   bookingUrl: string | null
// }

function toNumber(value) {
  if (value == null) return null;
  const n = Number(value);
  return Number.isNaN(n) ? null : n;
}

function baseHotel({ name, price, rating, image, location, source, bookingUrl }) {
  return {
    name: name || "Unknown Hotel",
    price: toNumber(price),
    rating: toNumber(rating),
    image: image || null,
    location: location || null,
    source,
    bookingUrl: bookingUrl || null,
  };
}

// SerpAPI (Google Hotels) normalization
function normalizeFromSerpApi(item) {
  const priceRaw =
    item.rate_per_night?.lowest ||
    item.rate_per_night ||
    item.rate ||
    item.price;

  return baseHotel({
    name: item.name,
    price: priceRaw,
    rating: item.overall_rating || item.rating,
    image: (item.images && item.images[0]) || item.thumbnail,
    location: item.address || item.location,
    source: "Google",
    bookingUrl: item.link || item.book_link,
  });
}

// Amadeus Hotels normalization
function normalizeFromAmadeus(offer) {
  const hotel = offer.hotel || {};
  const address = hotel.address || {};
  const priceRaw = offer.offers?.[0]?.price?.total;

  const locationParts = [address.cityName, address.countryCode].filter(Boolean);

  return baseHotel({
    name: hotel.name,
    price: priceRaw,
    rating: hotel.rating,
    image: hotel.media?.[0]?.uri,
    location: locationParts.join(", "),
    source: "Amadeus",
    bookingUrl: offer.self || null,
  });
}

// Booking.com normalization
function normalizeFromBooking(item) {
  const priceRaw =
    item.min_total_price || item.price_breakdown?.gross_price || item.price;

  const locationParts = [item.city, item.country_trans].filter(Boolean);

  return baseHotel({
    name: item.hotel_name || item.name,
    price: priceRaw,
    rating: item.review_score || item.reviewScore,
    image: item.main_photo_url || item.photo_url,
    location: locationParts.join(", "),
    source: "Booking",
    bookingUrl: item.url,
  });
}

module.exports = {
  normalizeFromSerpApi,
  normalizeFromAmadeus,
  normalizeFromBooking,
};

