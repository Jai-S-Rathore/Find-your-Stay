// Utility helpers to normalize different provider responses
// into a single common hotel shape used by the aggregator.
//
// Normalized format:
// {
//   name: string,
//   price: number | null,
//   rating: number | null,
//   image: string,
//   location: string | null,
//   source: string,
//   bookingUrl: string
// }

const DEFAULT_IMAGE = "/images/default-stay.jpg"; // ✅ Fallback for all sources

function toNumber(value) {
  if (value == null) return null;
  const n = Number(value);
  return Number.isNaN(n) ? null : n;
}

function baseHotel({ name, price, rating, image, location, source, bookingUrl }) {
  return {
    name:       name || "Unknown Hotel",
    price:      toNumber(price),
    rating:     toNumber(rating),
    image:      image || DEFAULT_IMAGE, // ✅ Never null — always has a fallback
    location:   location || null,
    source,
    bookingUrl: bookingUrl || "#",      // ✅ Never null — safe for <a href>
  };
}

// ─────────────────────────────────────────
// SerpAPI (Google Hotels)
// ─────────────────────────────────────────
function normalizeFromSerpApi(item) {
  const priceRaw =
    item.rate_per_night?.lowest ||
    item.rate_per_night ||
    item.rate ||
    item.price;

  // ✅ images[0] can be an object with thumbnail or a plain string
  const image =
    item.images?.[0]?.thumbnail ||
    item.images?.[0] ||
    item.thumbnail ||
    null;

  return baseHotel({
    name:       item.name,
    price:      priceRaw,
    rating:     item.overall_rating || item.rating,
    image,
    location:   item.address || item.location || null,
    source:     "Google",
    bookingUrl: item.link || item.book_link,
  });
}

// ─────────────────────────────────────────
// Amadeus Hotels
// ─────────────────────────────────────────
function normalizeFromAmadeus(offer) {
  const hotel    = offer.hotel || {};
  const address  = hotel.address || {};
  const priceRaw = offer.offers?.[0]?.price?.total;

  const locationParts = [address.cityName, address.countryCode].filter(Boolean);

  return baseHotel({
    name:       hotel.name,
    price:      priceRaw,
    rating:     hotel.rating,
    image:      hotel.media?.[0]?.uri || null,
    location:   locationParts.join(", ") || null,
    source:     "Amadeus",
    bookingUrl: offer.self || null,
  });
}

// ─────────────────────────────────────────
// Booking.com
// ─────────────────────────────────────────
function normalizeFromBooking(item) {
  const priceRaw =
    item.min_total_price ||
    item.price_breakdown?.gross_price ||
    item.price;

  const locationParts = [item.city, item.country_trans].filter(Boolean);

  // ✅ Booking.com URLs are relative — prepend domain
  const bookingUrl = item.url
    ? item.url.startsWith("http")
      ? item.url
      : `https://www.booking.com${item.url}`
    : null;

  return baseHotel({
    name:       item.hotel_name || item.name,
    price:      priceRaw,
    rating:     item.review_score || item.reviewScore,
    image:      item.main_photo_url || item.photo_url || null,
    location:   locationParts.join(", ") || null,
    source:     "Booking",
    bookingUrl,
  });
}

module.exports = {
  normalizeFromSerpApi,
  normalizeFromAmadeus,
  normalizeFromBooking,
};