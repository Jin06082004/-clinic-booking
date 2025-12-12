import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalClinics: 0,
    totalDoctors: 0,
    totalBookings: 0,
    pendingBookings: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [clinicsRes, doctorsRes, bookingsRes] = await Promise.all([
        api.get('/clinics'),
        api.get('/doctors'),
        api.get('/bookings')
      ]);

      const bookings = bookingsRes.data;
      setStats({
        totalClinics: clinicsRes.data.length,
        totalDoctors: doctorsRes.data.length,
        totalBookings: bookings.length,
        pendingBookings: bookings.filter(b => b.status === 'pending').length
      });

      setRecentBookings(bookings.slice(0, 5));
    } catch (err) {
      console.error('Thất bại khi fetch dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Đang tải bảng điều khiển...</div>;

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Bảng Điều Khiển Quản Trị</h1>
        <p>Xin chào, {user.name}!</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Tổng Phòng Khám</h3>
          <p className="stat-number">{stats.totalClinics}</p>
          <Link to="/clinics" className="stat-link">Xem Phòng Khám →</Link>
        </div>
        <div className="stat-card">
          <h3>Tổng Bác Sĩ</h3>
          <p className="stat-number">{stats.totalDoctors}</p>
        </div>
        <div className="stat-card">
          <h3>Tổng Lịch Hẹn</h3>
          <p className="stat-number">{stats.totalBookings}</p>
        </div>
        <div className="stat-card">
          <h3>Lịch Chờ Xác Nhận</h3>
          <p className="stat-number">{stats.pendingBookings}</p>
        </div>
      </div>

      <div className="recent-bookings">
        <h2>Lịch Hẹn Gần Đây</h2>
        {recentBookings.length === 0 ? (
          <p>Không có lịch hẹn gần đây</p>
        ) : (
          <table className="bookings-table">
            <thead>
              <tr>
                <th>Bệnh Nhân</th>
                <th>Phòng Khám</th>
                <th>Bác Sĩ</th>
                <th>Ngày</th>
                <th>Trạng Thái</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.map(booking => (
                <tr key={booking._id}>
                  <td>{booking.user?.name}</td>
                  <td>{booking.clinic?.name}</td>
                  <td>{booking.doctor?.name}</td>
                  <td>{new Date(booking.date).toLocaleDateString()}</td>
                  <td>
                    <span className={`status-badge status-${booking.status}`}>
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
