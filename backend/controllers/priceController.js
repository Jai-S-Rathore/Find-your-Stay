const db = require("../db");

// GET /api/prices/:stayId
async function getPricesForStay(req, res) {
  const { stayId } = req.params;

  try {
    const [prices] = await db.query(
      "SELECT id, platform, price, currency, url FROM stay_prices WHERE stay_id = ? ORDER BY price ASC",
      [stayId]
    );

    res.json(prices);
  } catch (error) {
    console.error("Error fetching prices for stay:", error);
    res.status(500).json({
      message: "Failed to fetch price comparison for the stay",
      error: error.message,
    });
  }
}

module.exports = {
  getPricesForStay,
};

