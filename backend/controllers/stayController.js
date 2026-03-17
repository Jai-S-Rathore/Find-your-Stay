const db = require("../db");

// Helper to map DB rows into API response shape
function mapStayRowToApi(stayRow, priceRowsByStayId) {
  const pricesForStay = priceRowsByStayId[stayRow.id] || [];

  const prices = pricesForStay.map((row) => ({
    platform: row.platform,
    price: row.price, // e.g. "₹4500"
    logo: row.logo || "",
  }));

  const ratings = stayRow.overall_rating
    ? [
        {
          platform: "Our Rating",
          rating: Number(stayRow.overall_rating),
          reviewCount: 0,
        },
      ]
    : [];

  // Fallback price to avoid empty array issues on the frontend
  const safePrices =
    prices.length > 0
      ? prices
      : [
          {
            platform: "Google",
            price: "₹0",
            logo: "",
          },
        ];

  return {
    id: stayRow.id,
    title: stayRow.name,
    location: stayRow.city,
    type: stayRow.type,
    image: stayRow.image_url,
    prices: safePrices,
    ratings,
    hostContact: {
      phone: stayRow.host_phone,
      email: stayRow.host_email,
      whatsapp: stayRow.host_whatsapp,
    },
  };
}

// GET /api/stays
async function getAllStays(req, res) {
  try {
    const city = (req.query.city || "").toString().trim();
    const type = (req.query.type || "").toString().trim();

    let whereClause = "WHERE 1=1";
    const params = [];

    if (city) {
      whereClause += " AND LOWER(s.city) LIKE LOWER(?)";
      params.push(`%${city}%`);
    }
    if (type) {
      whereClause += " AND LOWER(s.type) = LOWER(?)";
      params.push(type);
    }

    const [stays] = await db.query(
      `SELECT s.id, s.name, s.city, s.type, s.image_url, 
              s.overall_rating, s.host_email, s.host_phone, s.host_whatsapp
       FROM stays s
       ${whereClause}`,
      params
    );

    if (stays.length === 0) {
      return res.json([]);
    }

    const stayIds = stays.map((s) => s.id);
    const [priceRows] = await db.query(
      `SELECT stay_id, platform, price, '' AS logo 
       FROM stay_prices 
       WHERE stay_id IN (${stayIds.map(() => "?").join(",")})`,
      stayIds
    );

    const priceRowsByStayId = priceRows.reduce((acc, row) => {
      if (!acc[row.stay_id]) acc[row.stay_id] = [];
      acc[row.stay_id].push(row);
      return acc;
    }, {});

    const data = stays.map((row) => mapStayRowToApi(row, priceRowsByStayId));
    res.json(data);
  } catch (error) {
    console.error("Error fetching stays:", error);
    res.status(500).json({
      message: "Failed to fetch stays",
      error: error.message,
    });
  }
}

// GET /api/stays/:id
async function getStayById(req, res) {
  const { id } = req.params;

  try {
    const [rows] = await db.query(
      "SELECT id, name, city, type, image_url, overall_rating, host_email, host_phone, host_whatsapp FROM stays WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Stay not found" });
    }

    const [priceRows] = await db.query(
      "SELECT stay_id, platform, price, '' AS logo FROM stay_prices WHERE stay_id = ?",
      [id]
    );

    const priceRowsByStayId = {
      [id]: priceRows,
    };

    const stay = mapStayRowToApi(rows[0], priceRowsByStayId);

    res.json(stay);
  } catch (error) {
    console.error("Error fetching stay by id:", error);
    res.status(500).json({
      message: "Failed to fetch stay details",
      error: error.message,
    });
  }
}

module.exports = {
  getAllStays,
  getStayById,
};

