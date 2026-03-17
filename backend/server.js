const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
 
dotenv.config();
 
const staysRouter        = require("./routes/stays");
const comparePricesRouter = require("./routes/comparePrices");
const callLogRouter      = require("./routes/callLog"); // ✅ NEW
 
const app = express();
const PORT = process.env.PORT || 5000;
 
// Enable CORS for frontend at http://localhost:3000
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
 
// Parse JSON request bodies
app.use(express.json());
 
// Health check
app.get("/", (req, res) => {
  res.send("Find Your Stay Backend Running ✅");
});
 
// Stays API  →  /api/stays  &  /api/stays/:id
app.use("/api/stays", staysRouter);
 
// Price comparison  →  /api/compare-prices?city=Delhi
app.use("/api/compare-prices", comparePricesRouter); // ✅ FIXED path
 
// Call log  →  POST /api/call-log
app.use("/api/call-log", callLogRouter); // ✅ NEW
 
// Global error handler (fallback)
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    message: "Internal server error",
  });
});
 
app.listen(PORT, () => {
  console.log(`✅ Server running on port http://localhost:${PORT}`);
});