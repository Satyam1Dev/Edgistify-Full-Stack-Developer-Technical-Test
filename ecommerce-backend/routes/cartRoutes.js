const express = require("express");
const Cart = require("../models/Cart");
const Product = require("../Models/Product"); // You can remove if you're not using this model here
const router = express.Router();

// Add to cart
router.post("/add", async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;

        if (!userId || !productId || !quantity) {
            return res.status(400).json({ error: "User ID, Product ID, and Quantity are required" });
        }

        let cart = await Cart.findOne({ userId });

        // If no cart exists for the user, create a new one
        if (!cart) {
            cart = new Cart({ userId, items: [] });
        }

        if (!cart.items) cart.items = [];

        // Check if the item is already in the cart
        const existingItem = cart.items.find(item => item.productId.toString() === productId);

        if (existingItem) {
            existingItem.quantity += quantity; // If the item exists, increase its quantity
        } else {
            cart.items.push({ productId, quantity }); // If the item doesn't exist, add it to the cart
        }

        await cart.save();
        res.status(200).json({ message: "Item added to cart", cart });
    } catch (error) {
        console.error("Error adding product to cart:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Get cart (view items in cart)
// GET /api/cart route to fetch all items in the cart
router.get("/", async (req, res) => {
  try {
      const { userId } = req.query; // Retrieve the userId from the query parameter

      if (!userId) {
          return res.status(400).json({ error: "User ID is required" });
      }

      const cart = await Cart.findOne({ userId }).populate('items.productId'); // Assuming you're using Mongoose populate to fetch product details

      if (!cart) {
          return res.status(404).json({ message: "Cart not found" });
      }

      const products = cart.items.map(item => ({
          productId: item.productId._id,  // Assuming productId is an ObjectId that you want to return as string
          quantity: item.quantity,
      }));

      return res.status(200).json({ products });
  } catch (error) {
      console.error("Error fetching cart:", error);
      return res.status(500).json({ error: "Internal server error" });
  }
});


module.exports = router;
