require('dotenv').config();
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const staysRouter         = require("./routes/stayRoutes");
const comparePricesRouter = require("./routes/comparePrices");
const callLogRouter       = require("./routes/callLogRoutes");
const reviewRouter        = require("./routes/reviewRoutes");
const favoriteRouter = require("./routes/favoriteRoutes");
const searchRouter = require("./routes/searchRoutes");
const authRouter = require("./routes/authRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Find Your Stay Backend Running ✅" });
});

// API Routes
app.use("/api/stays",          staysRouter);        // GET /api/stays, GET /api/stays/:id
app.use("/api/compare-prices", comparePricesRouter); // GET /api/compare-prices?city=
app.use("/api/call-log",       callLogRouter);       // POST /api/call-log
app.use("/api/reviews",        reviewRouter);        // POST /api/reviews
app.use("/api/favorites",     favoriteRouter);
app.use("/api/search",        searchRouter);
app.use("/api/auth",         authRouter);
app.use("/api/favorites", favoriteRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ message: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});