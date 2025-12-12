import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Clinics from './pages/Clinics';
import ClinicDetail from './pages/ClinicDetail';
import Booking from './pages/Booking';
import Profile from './pages/Profile';
import History from './pages/History';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/clinics" element={<Clinics />} />
              <Route path="/clinics/:id" element={<ClinicDetail />} />
              <Route path="/booking" element={<Booking />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/history" element={<History />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
