import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav style={{ padding: "10px", background: "#f0f0f0" }}>
      <Link to="/">Home</Link> |{" "}
      <Link to="/products">Products</Link> |{" "}
      {token && (
        <>
          <Link to="/cart">Cart</Link> |{" "}
          <Link to="/orders">Orders</Link> |{" "}
          <button onClick={handleLogout}>Logout</button>
        </>
      )}
      {!token && (
        <>
          <Link to="/login">Login</Link> |{" "}
          <Link to="/register">Register</Link>
        </>
      )}
    </nav>
  );
};

export default Navbar;
