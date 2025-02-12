import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { fullName, email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://edgistify-full-stack-developer-technical.onrender.com/api/auth/register', { fullName, email, password });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div>
      <h2>Register</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={onSubmit}>
        <div>
          <label>Full Name: </label>
          <input type="text" name="fullName" value={fullName} onChange={onChange} required />
        </div>
        <div>
          <label>Email: </label>
          <input type="email" name="email" value={email} onChange={onChange} required />
        </div>
        <div>
          <label>Password: </label>
          <input type="password" name="password" value={password} onChange={onChange} required minLength="8" />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
