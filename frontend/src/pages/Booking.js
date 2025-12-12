import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { bookingService, clinicService, doctorService } from '../services/api';

const Booking = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    clinic: searchParams.get('clinic') || '',
    doctor: searchParams.get('doctor') || '',
    date: '',
    time: '',
    symptoms: '',
    notes: '',
  });
  const [clinic, setClinic] = useState(null);
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (formData.clinic) {
      fetchClinic();
    }
    if (formData.doctor) {
      fetchDoctor();
    }
  }, [formData.clinic, formData.doctor]);

  const fetchClinic = async () => {
    try {
      const response = await clinicService.getById(formData.clinic);
      setClinic(response.data);
    } catch (err) {
      console.error('Failed to fetch clinic');
    }
  };

  const fetchDoctor = async () => {
    try {
      const response = await doctorService.getById(formData.doctor);
      setDoctor(response.data);
    } catch (err) {
      console.error('Failed to fetch doctor');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await bookingService.create(formData);
      setSuccess('Booking created successfully!');
      setTimeout(() => {
        navigate('/history');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="booking-page">
      <div className="booking-container">
        <h1>Book Appointment</h1>

        {clinic && doctor && (
          <div className="booking-summary">
            <h3>Booking Details</h3>
            <p><strong>Clinic:</strong> {clinic.name}</p>
            <p><strong>Doctor:</strong> {doctor.name}</p>
            <p><strong>Specialty:</strong> {doctor.specialty}</p>
          </div>
        )}

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <form onSubmit={handleSubmit} className="booking-form">
          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className="form-group">
            <label>Time</label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Symptoms</label>
            <textarea
              name="symptoms"
              value={formData.symptoms}
              onChange={handleChange}
              placeholder="Describe your symptoms"
              rows="4"
            />
          </div>

          <div className="form-group">
            <label>Additional Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Any additional information"
              rows="3"
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Booking...' : 'Book Appointment'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Booking;
