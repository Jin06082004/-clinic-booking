import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { bookingService } from '../services/api';

const History = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      fetchBookings();
    }
  }, [isAuthenticated, navigate]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await bookingService.getAll();
      setBookings(response.data);
    } catch (err) {
      setError('Thất bại khi load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (id) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await bookingService.cancel(id);
        fetchBookings();
      } catch (err) {
        alert('Thất bại khi cancel booking');
      }
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'confirmed':
        return 'status-confirmed';
      case 'pending':
        return 'status-pending';
      case 'cancelled':
        return 'status-cancelled';
      case 'completed':
        return 'status-completed';
      default:
        return '';
    }
  };

  if (loading) return <div className="loading">Loading bookings...</div>;

  return (
    <div className="history-page">
      <div className="history-container">
        <h1>Lịch Hẹn Của Tôi</h1>

        {error && <div className="error-message">{error}</div>}

        {bookings.length === 0 ? (
          <div className="no-bookings">
            <p>You don't have any bookings yet.</p>
            <button onClick={() => navigate('/clinics')} className="btn btn-primary">
              Find Clinics
            </button>
          </div>
        ) : (
          <div className="bookings-list">
            {bookings.map((booking) => (
              <div key={booking._id} className="booking-card">
                <div className="booking-header">
                  <h3>{booking.clinic?.name}</h3>
                  <span className={`booking-status ${getStatusClass(booking.status)}`}>
                    {booking.status}
                  </span>
                </div>
                <div className="booking-details">
                  <p><strong>Doctor:</strong> {booking.doctor?.name}</p>
                  <p><strong>Specialty:</strong> {booking.doctor?.specialty}</p>
                  <p><strong>Ngày:</strong> {new Date(booking.date).toLocaleDateString()}</p>
                  <p><strong>Giờ:</strong> {booking.time}</p>
                  {booking.symptoms && (
                    <p><strong>Symptoms:</strong> {booking.symptoms}</p>
                  )}
                  {booking.notes && (
                    <p><strong>Ghi Chú:</strong> {booking.notes}</p>
                  )}
                </div>
                {booking.status === 'pending' && (
                  <button
                    onClick={() => handleCancelBooking(booking._id)}
                    className="btn btn-danger"
                  >
                    Cancel Booking
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
