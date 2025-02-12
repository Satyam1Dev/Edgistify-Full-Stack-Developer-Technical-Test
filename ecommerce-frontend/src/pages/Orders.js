import React, { useEffect, useState } from "react";
import axios from "axios";

const Orders = () => {
  const token = localStorage.getItem("token");
  const [cart, setCart] = useState(null);
  const [shippingAddress, setShippingAddress] = useState("");
  const [error, setError] = useState("");
  const [orders, setOrders] = useState([]);

  // Fetch cart data
  const fetchCart = async () => {
    if (!token) {
      setError("Please login to view your cart.");
      return;
    }

    try {
      const res = await axios.get("https://edgistify-full-stack-developer-technical.onrender.com/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data && res.data.products) {
        setCart(res.data); // Assuming cart data has a products key
      } else {
        setCart({ products: [] });
        setError("No items found in the cart.");
      }
    } catch (err) {
      console.error("Error fetching cart:", err);
      setError("Failed to fetch cart.");
    }
  };

  // Fetch orders
  const fetchOrders = async () => {
    try {
      const res = await axios.get("https://edgistify-full-stack-developer-technical.onrender.com/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
    } catch (err) {
      setError("Failed to fetch orders.");
    }
  };

  // Place an order
  const placeOrder = async () => {
    if (!cart || !cart.products || cart.products.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    // Add dummy price for products
    const productsWithPrice = cart.products.map(item => ({
      productId: item.productId,
      quantity: item.quantity,
      price: 10, // Dummy price
    }));
    const totalPrice = productsWithPrice.reduce((acc, item) => acc + item.quantity * item.price, 0);

    try {
      const res = await axios.post(
        "https://edgistify-full-stack-developer-technical.onrender.com/api/orders",
        { products: productsWithPrice, totalPrice, shippingAddress },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Order placed successfully!");
      setOrders([...orders, res.data]);
    } catch (err) {
      console.error("Error placing order:", err);
      setError("Failed to place order.");
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchCart();
  }, [token]);

  return (
    <div>
      <h2>Your Orders</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      
      <div style={{ marginBottom: "20px" }}>
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
      </div>

      <div>
        <h3>Order History</h3>
        {orders.length === 0 ? (
          <p>No orders placed yet</p>
        ) : (
          <ul>
            {orders.map((order) => (
              <li key={order._id} style={{ marginBottom: "10px" }}>
                <p>Order ID: {order._id}</p>
                <p>Total Price: ${order.totalPrice}</p>
                <p>Shipping Address: {order.shippingAddress}</p>
                <p>Payment Status: {order.paymentStatus}</p>
                <p>Order Status: {order.orderStatus}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <h3>Your Cart</h3>
        {cart && cart.products && cart.products.length === 0 ? (
          <p>Your cart is empty</p>
        ) : (
          <ul>
            {cart?.products?.map((item, index) => (
              <li key={index}>
                <p>Product ID: {item.productId}</p>
                <p>Quantity: {item.quantity}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Orders;
