import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const BookingHistory = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    fetchBookings();
  }, [user]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await api.get('/bookings');
      // Backend already filters by clinic for receptionist
      const bookings = response.data;
      // Sort by date descending (newest first)
      bookings.sort((a, b) => new Date(b.date) - new Date(a.date));
      setBookings(bookings);
    } catch (error) {
      console.error('Thất bại khi fetch bookings', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesStatus = filterStatus === 'all' || booking.status === filterStatus;
    
    let matchesDateRange = true;
    if (dateRange.startDate && dateRange.endDate) {
      const bookingDate = new Date(booking.date);
      const start = new Date(dateRange.startDate);
      const end = new Date(dateRange.endDate);
      matchesDateRange = bookingDate >= start && bookingDate <= end;
    }
    
    return matchesStatus && matchesDateRange;
  });

  const stats = {
    total: bookings.length,
    completed: bookings.filter(b => b.status === 'completed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
    pending: bookings.filter(b => b.status === 'pending').length,
  };

  if (loading) return <div className="loading">Loading history...</div>;

  return (
    <div className="receptionist-page">
      <div className="page-header">
        <h1>Lịch Sử Khám Bệnh</h1>
      </div>

      <div className="stats-summary">
        <div className="stat-item">
          <span className="stat-label">Tổng Bookings:</span>
          <span className="stat-value">{stats.total}</span>
        </div>
        <div className="stat-item completed">
          <span className="stat-label">Completed:</span>
          <span className="stat-value">{stats.completed}</span>
        </div>
        <div className="stat-item cancelled">
          <span className="stat-label">Cancelled:</span>
          <span className="stat-value">{stats.cancelled}</span>
        </div>
        <div className="stat-item pending">
          <span className="stat-label">Pending:</span>
          <span className="stat-value">{stats.pending}</span>
        </div>
      </div>

      <div className="filters-bar">
        <div className="filter-group">
          <label>Trạng Thái:</label>
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Trạng Thái</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="filter-group">
          <label>From:</label>
          <input
            type="date"
            value={dateRange.startDate}
            onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
          />
        </div>

        <div className="filter-group">
          <label>To:</label>
          <input
            type="date"
            value={dateRange.endDate}
            onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
          />
        </div>

        <button 
          className="btn btn-secondary"
          onClick={() => setDateRange({ startDate: '', endDate: '' })}
        >
          Clear Filters
        </button>
      </div>

      <div className="data-table">
        <table>
          <thead>
            <tr>
              <th>Ngày</th>
              <th>Giờ</th>
              <th>Patient</th>
              <th>Doctor</th>
              <th>Symptoms</th>
              <th>Trạng Thái</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.map((booking) => (
              <tr key={booking._id}>
                <td>{new Date(booking.date).toLocaleDateString()}</td>
                <td>{booking.time}</td>
                <td>
                  <div>
                    <div>{booking.user?.name}</div>
                    <small>{booking.user?.phone}</small>
                  </div>
                </td>
                <td>{booking.doctor?.name}</td>
                <td>
                  {booking.symptoms ? (
                    <div className="symptoms-preview">
                      {booking.symptoms.length > 50 
                        ? booking.symptoms.substring(0, 50) + '...' 
                        : booking.symptoms}
                    </div>
                  ) : (
                    <span className="no-data">-</span>
                  )}
                </td>
                <td>
                  <span className={`status-badge status-${booking.status}`}>
                    {booking.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredBookings.length === 0 && (
          <div className="no-results">
            <p>No bookings found matching the selected filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingHistory;
