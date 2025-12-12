import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          Clinic Booking
        </Link>
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/clinics" className="nav-link">
              Clinics
            </Link>
          </li>
          {isAuthenticated ? (
            <>
              <li className="nav-item">
                <Link to="/history" className="nav-link">
                  My Bookings
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/profile" className="nav-link">
                  Profile
                </Link>
              </li>
              <li className="nav-item">
                <button onClick={logout} className="nav-link btn-link">
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link to="/login" className="nav-link">
                  Login
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/register" className="nav-link">
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
