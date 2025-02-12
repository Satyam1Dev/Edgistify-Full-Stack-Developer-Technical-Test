import React, { useEffect, useState } from "react";
import axios from "axios";

const Cart = () => {
  const userData = localStorage.getItem("user"); // Retrieve the full user data from localStorage
  const token = localStorage.getItem("token"); // Retrieve token from localStorage

  // Ensure userId is parsed correctly from user data
  const [cart, setCart] = useState({ items: [] });
  const [error, setError] = useState("");
  let userId = null;

  if (userData) {
    try {
      const parsedUser = JSON.parse(userData); // Parse the user data if it exists
      userId = parsedUser.id; // Get the userId from parsed data
    } catch (e) {
      console.error("Error parsing user data:", e);
    }
  }

  // Function to fetch the cart
  const fetchCart = async () => {
    if (!userId || !token) {
      setError("Please login to view your cart.");
      return;
    }
  
    try {
      const res = await axios.get("http://localhost:5000/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
        params: { userId },
      });
  
      console.log("API Response:", res); // Log the full response for debugging
  
      if (res.data && Array.isArray(res.data.products)) {
        setCart({ items: res.data.products }); // Correctly set cart items from products
      } else {
        setError("No items found in the cart.");
      }
    } catch (err) {
      console.error("Error fetching cart:", err);
      setError("Failed to fetch cart.");
    }
  };
  

  useEffect(() => {
    fetchCart(); // Call the function to fetch the cart on initial render
  }, [userId, token]);

  const removeFromCart = async (productId) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/cart/remove", // Assuming a route to remove items
        { userId, productId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(res.data.message || "✅ Product removed from cart!");
      // Re-fetch the cart after removing an item
      fetchCart();
    } catch (err) {
      console.error("Error removing product from cart:", err);
      alert(err.response?.data?.error || "❌ Error removing product from cart");
    }
  };

  if (!userId) {
    return <div>Please login to view your cart.</div>;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>🛒 Your Cart</h2>

      {error && <p style={styles.error}>{error}</p>}

      {cart.items.length === 0 ? (
        <p style={styles.noItems}>Your cart is empty</p>
      ) : (
        <div style={styles.cartGrid}>
          {cart.items.map((item) => (
            <div key={item.productId} style={styles.cartCard}>
              <h3 style={styles.productTitle}>Product ID: {item.productId}</h3>
              <p style={styles.productQuantity}>Quantity: {item.quantity}</p>
              <button
                style={styles.button}
                onClick={() => removeFromCart(item.productId)}
              >
                ➖ Remove from Cart
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
  noItems: {
    fontSize: "18px",
    color: "#555",
  },
  cartGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
  },
  cartCard: {
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
  productQuantity: {
    fontSize: "16px",
    color: "#28a745",
  },
  button: {
    backgroundColor: "#dc3545",
    color: "#fff",
    padding: "10px 15px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "10px",
  },
};

export default Cart;
