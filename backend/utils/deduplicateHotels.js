// Utilities to deduplicate hotels that share the same
// name + location key and merge their prices arrays.

function makeKey(hotel) {
  const name = (hotel.name || "").trim().toLowerCase();
  const location = (hotel.location || "").trim().toLowerCase();
  return `${name}|${location}`;
}

function deduplicateHotels(hotels) {
  const byKey = new Map();

  for (const hotel of hotels) {
    if (!hotel || !hotel.name) continue;
    const key = makeKey(hotel);

    if (!byKey.has(key)) {
      // Clone and ensure prices is an array
      byKey.set(key, {
        ...hotel,
        prices: Array.isArray(hotel.prices) ? [...hotel.prices] : [],
      });
    } else {
      const existing = byKey.get(key);

      // Merge prices arrays
      const newPrices = Array.isArray(hotel.prices) ? hotel.prices : [];
      existing.prices.push(...newPrices);

      // Prefer non-null rating and image
      if (existing.rating == null && hotel.rating != null) {
        existing.rating = hotel.rating;
      }
      if (!existing.image && hotel.image) {
        existing.image = hotel.image;
      }
    }
  }

  // Deduplicate price entries per hotel (optional improvement)
  for (const entry of byKey.values()) {
    const seen = new Set();
    entry.prices = entry.prices.filter((p) => {
      const key = `${p.source}|${p.price}|${p.link}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  return Array.from(byKey.values());
}

module.exports = {
  deduplicateHotels,
};

