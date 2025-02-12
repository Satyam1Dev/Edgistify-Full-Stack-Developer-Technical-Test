import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/products');
        setProducts(res.data);
      } catch (err) {
        setError('Failed to fetch products');
      }
    };

    fetchProducts();
  }, []);

  const addToCart = async (productId) => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId'); // Ensure user ID is stored after login

    if (!token || !userId) {
      alert('Please login to add items to your cart.');
      return;
    }

    try {
      const res = await axios.post(
        'http://localhost:5000/api/cart/add', // Ensure the correct route
        { userId, productId, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(res.data.message || 'Product added to cart!');
    } catch (err) {
      alert(err.response?.data?.error || 'Error adding product to cart');
    }
  };

  return (
    <div>
      <h2>Products</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {products.length === 0 ? (
        <p>No products available</p>
      ) : (
        <ul>
          {products.map(product => (
            <li key={product._id} style={{ marginBottom: "20px" }}>
              <h3>{product.name}</h3>
              <p>Price: ${product.price}</p>
              <p>Stock: {product.stock}</p>
              <button onClick={() => addToCart(product._id)}>Add to Cart</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Products;
