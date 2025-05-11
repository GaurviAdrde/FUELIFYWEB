// src/components/LoginPage.jsx

import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';

import "./LoginPage.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Send the login request to the backend
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password }
      );

      console.log(response.data);

      // Store JWT token in localStorage
      localStorage.setItem("token", response.data.token);

      // Redirect based on role
      const userRole = response.data.role.toLowerCase(); // convert to lowercase for safety

      if (userRole === "user") {
        navigate("/user");
      } else if (userRole === "service") {
        navigate("/service");
      } else if (userRole === "admin") {
        navigate("/admin");
      } else {
        console.error("Unknown role:", userRole);
        setError("Unknown user role. Please contact support.");
      }
    } catch (err) {
      console.log(err);

      // Handle errors by setting the error message
      setError(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* Show error message if there is one */}
        {error && <div className="error-message">{error}</div>}

        <button type="submit">Login</button>
      </form>

      {/* Here is the "Create Account" link */}
      <p className="signup-link">
        Don't have an account? <Link to="/signup">Register here</Link>
      </p>
    </div>
  );
};

export default LoginPage;
