const express = require("express");
const Order = require("../Models/Order"); // Ensure you have this model
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// POST /api/orders - Place an order (Protected route)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { products, totalPrice, shippingAddress } = req.body;
    const userId = req.user.userId;

    if (!products || !totalPrice || !shippingAddress) {
      return res.status(400).json({ message: "Please provide products, totalPrice, and shippingAddress" });
    }
    // Create new order
    const newOrder = new Order({
      userId,
      products,
      totalPrice,
      shippingAddress,
      paymentStatus: "Pending", // default status
      orderStatus: "Pending"    // default status
    });
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
    console.error("Error placing order", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/orders - Get orders for the authenticated user (Protected route)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const orders = await Order.find({ userId });
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
