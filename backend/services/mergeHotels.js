// Service responsible for merging hotel lists from different providers,
// removing duplicates, and sorting by lowest price.
//
// Duplicate detection uses a composite key of lowercased hotel name + location.

function mergeHotels(hotelArrays) {
  const flat = hotelArrays.flat().filter(Boolean);

  const byKey = new Map();

  for (const hotel of flat) {
    if (!hotel || !hotel.name) continue;
    const nameKey = hotel.name.trim().toLowerCase();
    const locationKey = (hotel.location || "").trim().toLowerCase();
    const key = `${nameKey}|${locationKey}`;

    if (!byKey.has(key)) {
      byKey.set(key, { ...hotel });
    } else {
      const existing = byKey.get(key);

      // Keep the lowest price seen so far
      const existingPrice =
        typeof existing.price === "number" ? existing.price : Number.POSITIVE_INFINITY;
      const newPrice =
        typeof hotel.price === "number" ? hotel.price : Number.POSITIVE_INFINITY;

      if (newPrice < existingPrice) {
        existing.price = hotel.price;
        existing.source = hotel.source;
        existing.bookingUrl = hotel.bookingUrl;
      }

      // Prefer non-null rating and image
      if (existing.rating == null && hotel.rating != null) {
        existing.rating = hotel.rating;
      }
      if (!existing.image && hotel.image) {
        existing.image = hotel.image;
      }
    }
  }

  const merged = Array.from(byKey.values());

  // Sort hotels by price ascending, putting null/NaN prices at the end.
  merged.sort((a, b) => {
    const priceA = typeof a.price === "number" ? a.price : Number.POSITIVE_INFINITY;
    const priceB = typeof b.price === "number" ? b.price : Number.POSITIVE_INFINITY;
    return priceA - priceB;
  });

  return merged;
}

module.exports = {
  mergeHotels,
};

