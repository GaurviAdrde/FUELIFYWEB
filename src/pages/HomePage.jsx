// src/pages/HomePage.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

function HomePage() {
  return (
    <div className="homepage">
      {/* Header/Navbar */}
      <header className="navbar">
        <div className="logo">Fuelify</div>
        <nav>
          <Link to="/">Home</Link>
          <Link to="#about">About</Link>
          <Link to="#services">Services</Link>
          <Link to="/login">Login</Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <h1>Welcome to Fuelify!</h1>
        <p>Instant fuel delivery, vehicle breakdown assistance, towing services — anytime, anywhere.</p>
      </section>

      {/* About Section */}
      <section id="about" className="about">
        <h2>About Us</h2>
        <p>
          Fuelify is your on-demand solution for all vehicle emergencies. 
          Whether you're stuck without fuel or facing a breakdown, we're just a click away!
        </p>
      </section>

      {/* Services Section */}
      <section id="services" className="services">
        <h2>Our Services</h2>
        <div className="service-cards">
          <div className="card">
            <h3>Fuel Delivery</h3>
            <p>Get fuel delivered to your location instantly.</p>
          </div>
          <div className="card">
            <h3>Vehicle Breakdown Assistance</h3>
            <p>Quick help when your vehicle breaks down.</p>
          </div>
          <div className="card">
            <h3>Towing Service</h3>
            <p>Professional towing services for all vehicles.</p>
          </div>
          <div className="card">
            <h3>Emergency Assistance</h3>
            <p>24/7 emergency services whenever you need them.</p>
          </div>
        </div>
      </section>

      {/* Login/Signup Options */}
      <section className="options">
        <h2>Get Started</h2>
        <div className="buttons">
          <Link to="/login">
            <button>User Login / Signup</button>
          </Link>
          <Link to="/login">
            <button>Service Provider Login / Signup</button>
          </Link>
          <Link to="/login">
            <button>Admin Login</button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© 2025 Fuelify. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default HomePage;
