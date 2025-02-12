const express = require("express");
const Product = require("../Models/Product"); // Ensure you have this model

const router = express.Router();

// GET /api/products - Get all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error("Error fetching products", error);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/products - Create a new product (could be restricted to admins)
router.post("/", async (req, res) => {
  try {
    const { name, price, stock } = req.body;
    if (!name || price == null || stock == null) {
      return res.status(400).json({ message: "Please provide name, price, and stock" });
    }
    const newProduct = new Product({ name, price, stock });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error creating product", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
