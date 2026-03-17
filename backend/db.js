const mysql = require("mysql2/promise");
require('dotenv').config();
// MySQL connection pool for async/await queries
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Jaisr@123",
  database: "findyourstay",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test connection on startup
pool.getConnection()
  .then(conn => {
    console.log("✅ MySQL connected to:", process.env.DB_NAME);
    conn.release();
  })
  .catch(err => console.error("❌ MySQL connection failed:", err.message));

module.exports = pool;