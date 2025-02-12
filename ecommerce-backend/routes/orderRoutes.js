const express = require("express");
const Order = require("../models/Order"); // Ensure the path is correct
const router = express.Router();

// Place Order route
router.post("/", async (req, res) => {
    try {
        const { products, totalPrice, shippingAddress, userId } = req.body;

        // Check for required fields
        if (!products || !totalPrice || !shippingAddress || !userId) {
            return res.status(400).json({ message: "All fields are required." });
        }

        // Process the order here
        const newOrder = new Order({
            products,
            totalPrice,
            shippingAddress,
            userId,
            orderStatus: "Pending",
            paymentStatus: "Unpaid",
        });

        await newOrder.save();

        return res.status(201).json({ message: "Order placed successfully!", order: newOrder });
    } catch (err) {
        console.error("Error placing order:", err);
        return res.status(500).json({ message: "Error placing order", error: err.message });
    }
});

module.exports = router;
