import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      // ✅ Store token & user details properly
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.user._id); // Store userId separately
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div style={styles.container}>
      <h2>Login</h2>
      {error && <p style={styles.error}>{error}</p>}
      <form onSubmit={onSubmit} style={styles.form}>
        <div style={styles.inputGroup}>
          <label>Email: </label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={onChange}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.inputGroup}>
          <label>Password: </label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={onChange}
            required
            style={styles.input}
          />
        </div>
        <button type="submit" style={styles.button}>Login</button>
      </form>
    </div>
  );
};

const styles = {
  container: { maxWidth: "400px", margin: "50px auto", textAlign: "center" },
  form: { display: "flex", flexDirection: "column", gap: "15px" },
  inputGroup: { display: "flex", flexDirection: "column", alignItems: "center" },
  input: { padding: "8px", width: "100%", maxWidth: "250px", borderRadius: "5px", border: "1px solid #ccc" },
  button: { padding: "10px", border: "none", borderRadius: "5px", background: "#007bff", color: "#fff", cursor: "pointer" },
  error: { color: "red", fontWeight: "bold" },
};

export default Login;
