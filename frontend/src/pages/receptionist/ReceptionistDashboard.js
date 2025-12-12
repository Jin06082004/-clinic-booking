import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const ReceptionistDashboard = () => {
  const { user } = useAuth();
  const [todayBookings, setTodayBookings] = useState([]);
  const [stats, setStats] = useState({
    todayTotal: 0,
    pending: 0,
    confirmed: 0,
    completed: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/bookings');
      const allBookings = response.data;

      // Filter bookings for today (backend already filters by clinic for receptionist)
      const today = new Date().toISOString().split('T')[0];
      const clinicBookings = allBookings.filter(
        b => new Date(b.date).toISOString().split('T')[0] === today
      );

      setTodayBookings(clinicBookings);
      setStats({
        todayTotal: clinicBookings.length,
        pending: clinicBookings.filter(b => b.status === 'pending').length,
        confirmed: clinicBookings.filter(b => b.status === 'confirmed').length,
        completed: clinicBookings.filter(b => b.status === 'completed').length
      });
    } catch (err) {
      console.error('Thất bại khi fetch bookings', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (bookingId, newStatus) => {
    try {
      await api.put(`/bookings/${bookingId}`, { status: newStatus });
      fetchDashboardData();
    } catch (err) {
      alert('Thất bại khi update booking status');
    }
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;

  return (
    <div className="receptionist-dashboard">
      <div className="dashboard-header">
        <h1>Bảng Điều Khiển Lễ Tân</h1>
        <p>Xin chào back, {user.name}!</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Hôm nay's Appointments</h3>
          <p className="stat-number">{stats.todayTotal}</p>
        </div>
        <div className="stat-card pending">
          <h3>Pending</h3>
          <p className="stat-number">{stats.pending}</p>
        </div>
        <div className="stat-card confirmed">
          <h3>Confirmed</h3>
          <p className="stat-number">{stats.confirmed}</p>
        </div>
        <div className="stat-card completed">
          <h3>Completed</h3>
          <p className="stat-number">{stats.completed}</p>
        </div>
      </div>

      <div className="today-appointments">
        <h2>Hôm nay's Appointments</h2>
        {todayBookings.length === 0 ? (
          <p>No appointments scheduled for today</p>
        ) : (
          <div className="bookings-list">
            {todayBookings.map(booking => (
              <div key={booking._id} className="booking-item">
                <div className="booking-info">
                  <h3>{booking.user?.name}</h3>
                  <p><strong>Doctor:</strong> {booking.doctor?.name}</p>
                  <p><strong>Giờ:</strong> {booking.time}</p>
                  <p><strong>Phone:</strong> {booking.user?.phone}</p>
                  {booking.symptoms && (
                    <p><strong>Symptoms:</strong> {booking.symptoms}</p>
                  )}
                </div>
                <div className="booking-actions">
                  <span className={`status-badge status-${booking.status}`}>
                    {booking.status}
                  </span>
                  {booking.status === 'pending' && (
                    <button
                      onClick={() => handleUpdateStatus(booking._id, 'confirmed')}
                      className="btn btn-success"
                    >
                      Confirm
                    </button>
                  )}
                  {booking.status === 'confirmed' && (
                    <button
                      onClick={() => handleUpdateStatus(booking._id, 'completed')}
                      className="btn btn-primary"
                    >
                      Mark Complete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReceptionistDashboard;
