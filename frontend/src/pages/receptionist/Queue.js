import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const Queue = () => {
  const { user } = useAuth();
  const [todayBookings, setTodayBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTodayBookings();
    const interval = setInterval(fetchTodayBookings, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [user]);

  const fetchTodayBookings = async () => {
    try {
      setLoading(true);
      const response = await api.get('/bookings');
      const today = new Date().toISOString().split('T')[0];
      
      // Backend already filters by clinic for receptionist
      const filtered = response.data.filter(
        b => new Date(b.date).toISOString().split('T')[0] === today &&
        (b.status === 'confirmed' || b.status === 'pending')
      );
      
      // Sort by time
      filtered.sort((a, b) => a.time.localeCompare(b.time));
      setTodayBookings(filtered);
    } catch (error) {
      console.error('Thất bại khi fetch bookings', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      await api.put(`/bookings/${bookingId}`, { status: newStatus });
      fetchTodayBookings();
    } catch (error) {
      console.error('Error updating status', error);
      alert('Thất bại khi update booking status');
    }
  };

  const getQueuePosition = (index) => {
    return index + 1;
  };

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  if (loading) return <div className="loading">Loading queue...</div>;

  return (
    <div className="receptionist-page">
      <div className="page-header">
        <h1>Hôm nay's Queue</h1>
        <div className="current-time">
          Current Giờ: <strong>{getCurrentTime()}</strong>
        </div>
      </div>

      <div className="queue-stats">
        <div className="stat-box">
          <span className="stat-number">{todayBookings.length}</span>
          <span className="stat-label">Tổng Appointments</span>
        </div>
        <div className="stat-box pending">
          <span className="stat-number">
            {todayBookings.filter(b => b.status === 'pending').length}
          </span>
          <span className="stat-label">Waiting</span>
        </div>
        <div className="stat-box confirmed">
          <span className="stat-number">
            {todayBookings.filter(b => b.status === 'confirmed').length}
          </span>
          <span className="stat-label">In Progress</span>
        </div>
      </div>

      <div className="queue-container">
        {todayBookings.length === 0 ? (
          <div className="empty-queue">
            <p>📋 No appointments in queue for today</p>
          </div>
        ) : (
          <div className="queue-list">
            {todayBookings.map((booking, index) => (
              <div key={booking._id} className={`queue-item ${booking.status}`}>
                <div className="queue-position">
                  <span className="position-number">#{getQueuePosition(index)}</span>
                </div>
                
                <div className="queue-details">
                  <div className="patient-info">
                    <h3>{booking.user?.name}</h3>
                    <p className="phone">📞 {booking.user?.phone}</p>
                  </div>
                  
                  <div className="appointment-info">
                    <p><strong>Doctor:</strong> {booking.doctor?.name}</p>
                    <p><strong>Giờ:</strong> {booking.time}</p>
                    {booking.symptoms && (
                      <p><strong>Symptoms:</strong> {booking.symptoms}</p>
                    )}
                  </div>
                </div>

                <div className="queue-status">
                  <span className={`status-badge status-${booking.status}`}>
                    {booking.status}
                  </span>
                  
                  <div className="queue-actions">
                    {booking.status === 'pending' && (
                      <>
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() => handleStatusUpdate(booking._id, 'confirmed')}
                        >
                          Start Consultation
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleStatusUpdate(booking._id, 'cancelled')}
                        >
                          Cancel
                        </button>
                      </>
                    )}
                    {booking.status === 'confirmed' && (
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => handleStatusUpdate(booking._id, 'completed')}
                      >
                        Mark Complete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Queue;
