import React, { useEffect, useState } from "react";
import axios from "axios";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("https://edgistify-full-stack-developer-technical.onrender.com/api/products");
        setProducts(res.data);
      } catch (err) {
        setError("❌ Failed to fetch products");
        console.error("Fetch Error:", err);
      }
    };

    fetchProducts();
  }, []);

  const addToCart = async (productId) => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    // 🛑 Parse user data correctly
    let userId = null;
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        userId = parsedUser.id; // Extracting user ID correctly
      } catch (e) {
        console.error("Error parsing user data:", e);
      }
    }

    // 🛑 Ensure `userId` and `token` exist
    if (!token || !userId) {
      alert("⚠️ Please login to add items to your cart.");
      console.error("Error: Missing userId or token:", { userId, token });
      return;
    }

    try {
      console.log(`🛒 Adding product ${productId} to cart for user ${userId}`);
      const res = await axios.post(
        "https://edgistify-full-stack-developer-technical.onrender.com/api/cart/add",
        { userId, productId, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(res.data.message || "✅ Product added to cart!");
    } catch (err) {
      console.error("❌ Add to Cart Error:", err.response ? err.response.data : err);
      alert(err.response?.data?.error || "❌ Error adding product to cart");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>🛍️ Available Products</h2>

      {error && <p style={styles.error}>{error}</p>}

      {products.length === 0 ? (
        <p style={styles.noProducts}>No products available</p>
      ) : (
        <div style={styles.productGrid}>
          {products.map((product) => (
            <div key={product._id} style={styles.productCard}>
              <h3 style={styles.productTitle}>{product.name}</h3>
              <p style={styles.productPrice}>💰 Price: ${product.price}</p>
              <p style={styles.productStock}>📦 Stock: {product.stock}</p>
              <button style={styles.button} onClick={() => addToCart(product._id)}>
                ➕ Add to Cart
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ✅ Styled components
const styles = {
  container: {
    maxWidth: "800px",
    margin: "auto",
    padding: "20px",
    textAlign: "center",
  },
  heading: {
    color: "#333",
    marginBottom: "20px",
  },
  error: {
    color: "red",
    fontWeight: "bold",
  },
  noProducts: {
    fontSize: "18px",
    color: "#555",
  },
  productGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
  },
  productCard: {
    border: "1px solid #ddd",
    padding: "15px",
    borderRadius: "10px",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    backgroundColor: "#fff",
  },
  productTitle: {
    fontSize: "18px",
    color: "#333",
    marginBottom: "10px",
  },
  productPrice: {
    fontSize: "16px",
    color: "#28a745",
    fontWeight: "bold",
  },
  productStock: {
    fontSize: "14px",
    color: "#555",
  },
  button: {
    backgroundColor: "#007bff",
    color: "#fff",
    padding: "10px 15px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "10px",
  },
};

export default Products;