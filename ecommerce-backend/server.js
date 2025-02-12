const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config(); // Load environment variables from .env file

// Import routes
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes"); // ✅ Ensure path is correct
const orderRoutes = require("./routes/orderRoutes");

// Initialize express app
const app = express();

// Middleware setup
app.use(cors());
app.use(express.json());

// Use routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

// MongoDB URI validation
if (!process.env.MONGO_URI) {
  console.error("Error: MONGO_URI is not defined in .env file!");
  process.exit(1); // Exit if MONGO_URI is missing
}

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,  // Ensure deprecated options are handled
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => {
    console.error("MongoDB Connection Error:", err);
    process.exit(1); // Exit if connection fails
  });

// 404 Handler for undefined routes
app.use((req, res) => {
  res.status(404).json({ message: "Route Not Found" });
});

// Global error handler middleware
app.use((err, _, res, __) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
