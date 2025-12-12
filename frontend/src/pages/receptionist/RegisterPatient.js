import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const RegisterPatient = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/auth/register', {
        ...formData,
        role: 'user',
      });
      alert('Patient registered successfully! You can now create a booking for them.');
      navigate('/receptionist/new-booking');
    } catch (error) {
      console.error('Error registering patient', error);
      alert(error.response?.data?.message || 'Thất bại khi register patient');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="receptionist-page">
      <div className="page-header">
        <h1>Register New Patient</h1>
      </div>

      <div className="register-patient-container">
        <div className="info-box">
          <h3>ℹ️ Patient Registration</h3>
          <p>Register a new patient in the system. They will receive login credentials via email.</p>
          <ul>
            <li>All fields are required</li>
            <li>Email must be unique</li>
            <li>Password should be at least 6 characters</li>
          </ul>
        </div>

        <form onSubmit={handleSubmit} className="patient-form">
          <div className="form-group">
            <label>Full Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              placeholder="Enter patient's full name"
            />
          </div>

          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder="patient@example.com"
            />
          </div>

          <div className="form-group">
            <label>Số Điện Thoại *</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
              placeholder="+1234567890"
            />
          </div>

          <div className="form-group">
            <label>Initial Password *</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              minLength="6"
              placeholder="Minimum 6 characters"
            />
            <small className="form-hint">
              Patient can change this password after first login
            </small>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Registering...' : 'Đăng Ký Bệnh Nhân'}
            </button>
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={() => navigate('/receptionist/new-booking')}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPatient;
