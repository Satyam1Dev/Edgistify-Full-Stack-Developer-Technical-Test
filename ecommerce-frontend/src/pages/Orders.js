import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Orders = () => {
  const token = localStorage.getItem('token');
  const [orders, setOrders] = useState([]);
  const [shippingAddress, setShippingAddress] = useState('');
  const [error, setError] = useState('');
  const [cart, setCart] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/orders', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchCart = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/cart', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCart(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchOrders();
    fetchCart();
  }, [token]);

  const placeOrder = async () => {
    if (!cart || !cart.products || cart.products.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    // For demonstration, assign a dummy price of 10 for each product.
    const productsWithPrice = cart.products.map(item => ({
      productId: item.productId,
      quantity: item.quantity,
      price: 10
    }));
    const totalPrice = productsWithPrice.reduce((acc, item) => acc + item.quantity * item.price, 0);

    try {
      const res = await axios.post(
        'http://localhost:5000/api/orders',
        { products: productsWithPrice, totalPrice, shippingAddress },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Order placed successfully!");
      setOrders([...orders, res.data]);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order');
    }
  };

  return (
    <div>
      <h2>Your Orders</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
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
            {orders.map(order => (
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
    </div>
  );
};

export default Orders;
