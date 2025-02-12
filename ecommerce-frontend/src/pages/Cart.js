import React, { useEffect, useState } from "react";
import axios from "axios";

const Cart = () => {
  const userId = localStorage.getItem("userId");
  const [cart, setCart] = useState({ products: [] });
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!userId) {
      setError("Please login to view your cart.");
      return;
    }
    
    if (!token) {
      setError("User is not authenticated.");
      return;
    }

    const fetchCart = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/cart", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCart(res.data);
      } catch (err) {
        setError("Failed to fetch cart");
      }
    };

    fetchCart();
  }, [userId, token]); // ✅ Dependency array includes `userId`

  if (!userId) {
    return <div>Please login to view your cart.</div>;
  }

  return (
    <div>
      <h2>Your Cart</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {(!cart.products || cart.products.length === 0) ? (
        <p>Your cart is empty</p>
      ) : (
        <ul>
          {cart.products.map((item, index) => (
            <li key={index}>
              <p>Product ID: {item.productId}</p>
              <p>Quantity: {item.quantity}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Cart;
