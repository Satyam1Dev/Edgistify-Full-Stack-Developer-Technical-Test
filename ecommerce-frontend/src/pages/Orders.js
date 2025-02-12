import React, { useEffect, useState } from "react";
import axios from "axios";

const Order = () => {
  const userData = localStorage.getItem("user"); // Retrieve the full user data from localStorage
  const token = localStorage.getItem("token"); // Retrieve token from localStorage

  // Ensure userId is parsed correctly from user data
  const [cart, setCart] = useState({ items: [] });
  const [error, setError] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [orderError, setOrderError] = useState("");
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
      const res = await axios.get("https://edgistify-full-stack-developer-technical.onrender.com/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
        params: { userId }, // Send userId as query param
      });

      console.log("API Response:", res); // Log the full response for debugging

      if (res.data && Array.isArray(res.data.products)) {
        setCart({ items: res.data.products }); // Set cart items from products
      } else {
        setError("No items found in the cart.");
      }
    } catch (err) {
      console.error("Error fetching cart:", err);
      setError("Failed to fetch cart.");
    }
  };

  // Function to place an order
  const placeOrder = async () => {
    if (!cart.items.length) {
      alert("Your cart is empty!");
      return;
    }

    if (!shippingAddress) {
      alert("Please enter a shipping address.");
      return;
    }

    try {
      const productsWithPrice = cart.items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        price: 10, // Assuming a fixed price of 10 per product for simplicity
      }));

      const totalPrice = productsWithPrice.reduce(
        (acc, item) => acc + item.quantity * item.price,
        0
      );

      const res = await axios.post(
        "https://edgistify-full-stack-developer-technical.onrender.com/api/orders",
        { products: productsWithPrice, totalPrice, shippingAddress },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Order placed successfully!");
      console.log("Order Response:", res);
      setCart({ items: [] }); // Clear cart after placing order
    } catch (err) {
      console.error("Error placing order:", err);
      setOrderError("Failed to place order.");
    }
  };

  useEffect(() => {
    fetchCart(); // Fetch cart data on initial render
  }, [userId, token]);

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
            </div>
          ))}
        </div>
      )}

      <div style={styles.orderSection}>
        <h3>Place a New Order</h3>
        <div>
          <label>Shipping Address: </label>
          <input
            type="text"
            value={shippingAddress}
            onChange={(e) => setShippingAddress(e.target.value)}
            placeholder="Enter your shipping address"
          />
        </div>
        <button onClick={placeOrder}>Place Order</button>
        {orderError && <p style={{ color: 'red' }}>{orderError}</p>}
      </div>
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
  orderSection: {
    marginTop: "20px",
  },
};

export default Cart;
