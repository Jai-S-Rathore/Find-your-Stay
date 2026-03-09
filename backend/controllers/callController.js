const db = require("../db");

// POST /api/call-log
// Track calls and restrict to maximum 3 per user per day (per stay).
async function logCall(req, res) {
  const { stayId, userId } = req.body;

  if (!stayId || !userId) {
    return res.status(400).json({
      message: "stayId and userId are required",
    });
  }

  try {
    const [rows] = await db.query(
      "SELECT COUNT(*) AS callCount FROM call_logs WHERE user_id = ? AND stay_id = ? AND DATE(called_at) = CURDATE()",
      [userId, stayId]
    );

    const currentCount = rows[0] ? Number(rows[0].callCount) || 0 : 0;

    if (currentCount >= 3) {
      return res.status(403).json({
        message: "Daily call limit reached for this stay",
      });
    }

    await db.query(
      "INSERT INTO call_logs (user_id, stay_id, called_at) VALUES (?, ?, NOW())",
      [userId, stayId]
    );

    const [stayRows] = await db.query(
      "SELECT host_email, host_phone, host_whatsapp FROM stays WHERE id = ?",
      [stayId]
    );

    if (stayRows.length === 0) {
      return res.status(404).json({
        message: "Stay not found",
      });
    }

    const remainingCalls = Math.max(0, 3 - (currentCount + 1));

    res.status(201).json({
      message: "Call logged successfully",
      remainingCalls,
      contact: {
        email: stayRows[0].host_email,
        phone: stayRows[0].host_phone,
        whatsapp: stayRows[0].host_whatsapp,
      },
    });
  } catch (error) {
    console.error("Error logging call:", error);
    res.status(500).json({
      message: "Failed to log call",
      error: error.message,
    });
  }
}

module.exports = {
  logCall,
};

