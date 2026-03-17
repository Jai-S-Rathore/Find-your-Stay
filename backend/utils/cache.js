// Simple in-memory cache for hotel search results.
// - Cache key: city name (lowercased)
// - Value: { data: any, expiresAt: number }
// This keeps recent search results for a limited duration to
// reduce external API calls and improve response times.

const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes
const cacheStore = new Map();

function makeKey(city) {
  return (city || "").trim().toLowerCase();
}

function getFromCache(city) {
  const key = makeKey(city);
  const entry = cacheStore.get(key);
  if (!entry) return null;

  if (Date.now() > entry.expiresAt) {
    cacheStore.delete(key);
    return null;
  }

  return entry.data;
}

function setCache(city, data) {
  const key = makeKey(city);
  cacheStore.set(key, {
    data,
    expiresAt: Date.now() + CACHE_TTL_MS,
  });
}

module.exports = {
  getFromCache,
  setCache,
};

