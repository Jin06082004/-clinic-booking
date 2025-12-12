import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { translateStatus } from '../../utils/helpers';

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await api.get('/bookings');
      setBookings(response.data);
    } catch (error) {
      console.error('Failed to fetch bookings', error);
      alert('Tải danh sách lịch hẹn thất bại');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      await api.put(`/bookings/${bookingId}`, { status: newStatus });
      alert('Cập nhật trạng thái thành công');
      fetchBookings();
    } catch (error) {
      console.error('Error updating booking', error);
      alert('Cập nhật trạng thái thất bại');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa lịch hẹn này?')) {
      return;
    }

    try {
      await api.delete(`/bookings/${id}`);
      alert('Xóa lịch hẹn thành công');
      fetchBookings();
    } catch (error) {
      console.error('Error deleting booking', error);
      alert('Xóa lịch hẹn thất bại');
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesStatus = filterStatus === 'all' || booking.status === filterStatus;
    const matchesSearch = searchTerm === '' || 
      booking.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.clinic?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.doctor?.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
  };

  if (loading) return <div className="loading">Loading bookings...</div>;

  return (
    <div className="manage-page">
      <div className="page-header">
        <h1>Quản Lý Lịch Hẹn</h1>
      </div>

      <div className="stats-summary">
        <div className="stat-item">
          <span className="stat-label">Tổng:</span>
          <span className="stat-value">{stats.total}</span>
        </div>
        <div className="stat-item pending">
          <span className="stat-label">Pending:</span>
          <span className="stat-value">{stats.pending}</span>
        </div>
        <div className="stat-item confirmed">
          <span className="stat-label">Confirmed:</span>
          <span className="stat-value">{stats.confirmed}</span>
        </div>
        <div className="stat-item completed">
          <span className="stat-label">Completed:</span>
          <span className="stat-value">{stats.completed}</span>
        </div>
        <div className="stat-item cancelled">
          <span className="stat-label">Cancelled:</span>
          <span className="stat-value">{stats.cancelled}</span>
        </div>
      </div>

      <div className="filters-bar">
        <input
          type="text"
          placeholder="Tìm kiếm theo bệnh nhân, phòng khám hoặc bác sĩ..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select 
          value={filterStatus} 
          onChange={(e) => setFilterStatus(e.target.value)}
          className="status-filter"
        >
          <option value="all">Tất Cả Trạng Thái</option>
          <option value="pending">Chờ xác nhận</option>
          <option value="confirmed">Đã xác nhận</option>
          <option value="completed">Hoàn thành</option>
          <option value="cancelled">Đã hủy</option>
        </select>
      </div>

      <div className="data-table">
        <table>
          <thead>
            <tr>
              <th>Bệnh Nhân</th>
              <th>Phòng Khám</th>
              <th>Bác Sĩ</th>
              <th>Ngày</th>
              <th>Giờ</th>
              <th>Trạng Thái</th>
              <th>Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.map((booking) => (
              <tr key={booking._id}>
                <td>
                  <div>
                    <div>{booking.user?.name}</div>
                    <small>{booking.user?.phone}</small>
                  </div>
                </td>
                <td>{booking.clinic?.name}</td>
                <td>{booking.doctor?.name}</td>
                <td>{new Date(booking.date).toLocaleDateString('vi-VN')}</td>
                <td>{booking.time}</td>
                <td>
                  <select
                    className={`status-selector status-${booking.status}`}
                    value={booking.status}
                    onChange={(e) => handleStatusChange(booking._id, e.target.value)}
                  >
                    <option value="pending">Chờ xác nhận</option>
                    <option value="confirmed">Đã xác nhận</option>
                    <option value="completed">Hoàn thành</option>
                    <option value="cancelled">Đã hủy</option>
                  </select>
                </td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className="btn btn-sm btn-delete" 
                      onClick={() => handleDelete(booking._id)}
                    >
                      Xóa
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageBookings;
