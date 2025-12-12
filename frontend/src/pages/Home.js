import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home">
      <div className="hero">
        <div className="hero-content">
          <h1>Welcome to Clinic Booking</h1>
          <p>Find and book appointments with the best clinics and doctors near you</p>
          <Link to="/clinics" className="btn btn-primary">
            Find Clinics
          </Link>
        </div>
      </div>
      
      <div className="features">
        <h2>Why Choose Us?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>Easy Booking</h3>
            <p>Book appointments with just a few clicks</p>
          </div>
          <div className="feature-card">
            <h3>Verified Clinics</h3>
            <p>All clinics and doctors are verified professionals</p>
          </div>
          <div className="feature-card">
            <h3>Manage Bookings</h3>
            <p>View and manage all your appointments in one place</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
