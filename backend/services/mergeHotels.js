// Service responsible for merging hotel lists from different providers,
// removing duplicates, and sorting by lowest price.
//
// Duplicate detection uses lowercased hotel name.
// ✅ KEY FIX: All platform prices are kept (not just the cheapest)
//    because this is a COMPARISON platform — users need to see all options.

function mergeHotels(hotelArrays) {
  // ✅ Works whether called with flat array or array-of-arrays
  const flat = Array.isArray(hotelArrays[0])
    ? hotelArrays.flat().filter(Boolean)
    : hotelArrays.filter(Boolean);

  const byKey = new Map();

  for (const hotel of flat) {
    if (!hotel || !hotel.name) continue;

    const key = hotel.name.trim().toLowerCase();

    if (!byKey.has(key)) {
      // First time seeing this hotel — create entry with prices array
      byKey.set(key, {
        name:     hotel.name.trim(),
        rating:   hotel.rating ?? null,
        image:    hotel.image || "/images/default-stay.jpg",
        location: hotel.location || null,
        prices:   [],
      });
    }

    const existing = byKey.get(key);

    // ✅ Accumulate ALL platform prices (core feature of comparison platform)
    const platformName = hotel.source || hotel.platform || "Unknown";
    const alreadyHas   = existing.prices.some((p) => p.platform === platformName);

    if (!alreadyHas && hotel.price != null) {
      existing.prices.push({
        platform: platformName,
        price:    hotel.price,
        link:     hotel.bookingUrl || hotel.link || "#",
      });
    }

    // Keep best rating and image across all sources
    if (existing.rating == null && hotel.rating != null) {
      existing.rating = hotel.rating;
    }
    if (
      (!existing.image || existing.image === "/images/default-stay.jpg") &&
      hotel.image &&
      hotel.image !== "/images/default-stay.jpg"
    ) {
      existing.image = hotel.image;
    }
  }

  const merged = Array.from(byKey.values());

  // ✅ Add lowest_price field and sort prices within each hotel cheapest first
  return merged
    .map((hotel) => ({
      ...hotel,
      prices: hotel.prices.sort((a, b) => a.price - b.price),
      lowest_price: hotel.prices.length
        ? Math.min(...hotel.prices.map((p) => p.price))
        : null,
    }))
    .filter((h) => h.prices.length > 0) // ✅ Remove hotels with no prices at all
    .sort((a, b) => {
      // Sort by lowest_price ascending, nulls go to end
      const pa = a.lowest_price ?? Number.POSITIVE_INFINITY;
      const pb = b.lowest_price ?? Number.POSITIVE_INFINITY;
      return pa - pb;
    });
}

module.exports = { mergeHotels };