const db = require("../db");

/**
 * Fetch aggregated call counts per stay for a given user.
 * Returns an object: { [stayId]: callCount }
 */
async function getUserCallCounts(userId) {
  const callCounts = {};

  if (!userId) {
    return callCounts;
  }

  const [rows] = await db.query(
    "SELECT stay_id, COUNT(*) AS callCount FROM call_logs WHERE user_id = ? GROUP BY stay_id",
    [userId]
  );

  rows.forEach((row) => {
    callCounts[row.stay_id] = Number(row.callCount) || 0;
  });

  return callCounts;
}

/**
 * Apply phone-visibility rules to a single stay.
 * Mutates and returns the stay object.
 */
function maskPhoneForStay(stay, callCounts, hasUser) {
  if (!stay) return stay;

  if (!hasUser) {
    stay.canCall = false;
    stay.host_phone = null;
    return stay;
  }

  const count = callCounts[stay.id] || 0;
  const canCall = count < 3;

  stay.canCall = canCall;
  if (!canCall) {
    stay.host_phone = null;
  }

  return stay;
}

/**
 * Apply phone-visibility rules to an array of stays.
 */
function maskPhoneForStays(stays, callCounts, hasUser) {
  if (!Array.isArray(stays)) return stays;

  return stays.map((stay) => maskPhoneForStay(stay, callCounts, hasUser));
}

module.exports = {
  getUserCallCounts,
  maskPhoneForStay,
  maskPhoneForStays,
};

