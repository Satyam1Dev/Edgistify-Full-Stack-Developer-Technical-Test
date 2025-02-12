const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config();

// Import routes
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes"); // Import the order routes

// Initialize Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Automatically parse incoming JSON requests

// Register routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);  // Register cart routes
app.use("/api/orders", orderRoutes); // Register order routes

// MongoDB Connection
if (!process.env.MONGO_URI) {
    console.error("Error: MONGO_URI is not defined in .env file!");
    process.exit(1);
}

mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => {
        console.error("MongoDB Connection Error:", err);
        process.exit(1);
    });

// 404 Route Handler (for undefined routes)
app.use((req, res) => {
    res.status(404).json({ message: "Route Not Found" });
});

// Global Error Handler (for catching unhandled errors)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Internal Server Error" });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
