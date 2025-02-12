const express = require("express");
const Cart = require("../Models/Cart.js");
const router = express.Router();

// POST request to add item to the cart
router.post("/add", async (req, res) => {
  const { userId, productId, quantity } = req.body;

  // Check if userId, productId, and quantity are provided
  if (!userId || !productId || !quantity) {
    return res.status(400).json({ error: "User ID, Product ID, and Quantity are required" });
  }

  try {
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      // If no cart exists for the user, create a new one
      cart = new Cart({
        userId,
        items: [{ productId, quantity }],
      });
      await cart.save();
      return res.status(201).json({ message: "Cart created and item added", cart });
    } else {
      // Check if the product is already in the cart
      const existingItem = cart.items.find((item) => item.productId.toString() === productId);

      if (existingItem) {
        // If the product exists, just update the quantity
        existingItem.quantity += quantity;
      } else {
        // Otherwise, add a new product to the cart
        cart.items.push({ productId, quantity });
      }

      // Save the updated cart
      await cart.save();
      res.status(200).json({ message: "Item added to cart", cart });
    }

  } catch (error) {
    console.error("Error adding product to cart:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Fix: Ensure we export the `router`
module.exports = router;
