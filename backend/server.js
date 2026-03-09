const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const staysRouter = require("./routes/stays");
const comparePricesRouter = require("./routes/comparePrices");

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
  res.send("Find Your Stay Backend Running");
});

// Stays API
app.use("/api/stays", staysRouter);
// External price comparison API
app.use("/api/compare-prices", comparePricesRouter);

// Global error handler (fallback)
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    message: "Internal server error",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});