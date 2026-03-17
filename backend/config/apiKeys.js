// Centralized accessors for external API keys.
// This makes it easier to validate presence and swap sources if needed.

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    console.warn(`${name} is not set in environment variables`);
  }
  return value;
}

module.exports = {
  getSerpApiKey: () => requireEnv("SERP_API_KEY"),
  getRapidApiKey: () => requireEnv("RAPIDAPI_KEY"),
  getAmadeusApiKey: () => requireEnv("AMADEUS_API_KEY"),
  getAmadeusSecret: () => requireEnv("AMADEUS_SECRET"),
};

