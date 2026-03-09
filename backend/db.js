const mysql = require("mysql2/promise");

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

module.exports = pool;