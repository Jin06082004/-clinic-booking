import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterRole, setFilterRole] = useState('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersRes, clinicsRes] = await Promise.all([
        api.get('/auth/users'),
        api.get('/clinics')
      ]);
      setUsers(usersRes.data);
      setClinics(clinicsRes.data);
    } catch (error) {
      console.error('Thất bại khi fetch data', error);
      alert('Thất bại khi load users');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.put(`/auth/users/${userId}/role`, { role: newRole });
      alert('User role updated successfully');
      fetchData();
    } catch (error) {
      console.error('Error updating role', error);
      alert('Thất bại khi update user role');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      await api.delete(`/auth/users/${id}`);
      alert('User deleted successfully');
      fetchData();
    } catch (error) {
      console.error('Error deleting user', error);
      alert('Thất bại khi delete user');
    }
  };

  const filteredUsers = filterRole === 'all' 
    ? users 
    : users.filter(user => user.role === filterRole);

  if (loading) return <div className="loading">Loading users...</div>;

  return (
    <div className="manage-page">
      <div className="page-header">
        <h1>Quản Lý Người Dùng</h1>
        <div className="filter-section">
          <label>Filter by Role:</label>
          <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
            <option value="all">All Roles</option>
            <option value="user">Users</option>
            <option value="receptionist">Receptionists</option>
            <option value="admin">Admins</option>
          </select>
        </div>
      </div>

      <div className="stats-summary">
        <div className="stat-item">
          <span className="stat-label">Tổng Users:</span>
          <span className="stat-value">{users.filter(u => u.role === 'user').length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Receptionists:</span>
          <span className="stat-value">{users.filter(u => u.role === 'receptionist').length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Admins:</span>
          <span className="stat-value">{users.filter(u => u.role === 'admin').length}</span>
        </div>
      </div>

      <div className="data-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Clinic</th>
              <th>Joined</th>
              <th>Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>
                  <span className={`role-badge role-${user.role}`}>
                    {user.role}
                  </span>
                </td>
                <td>{user.clinic?.name || 'N/A'}</td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>
                  <div className="action-buttons">
                    <select
                      className="role-selector"
                      value={user.role}
                      onChange={(e) => handleRoleChange(user._id, e.target.value)}
                    >
                      <option value="user">User</option>
                      <option value="receptionist">Receptionist</option>
                      <option value="admin">Admin</option>
                    </select>
                    <button 
                      className="btn btn-sm btn-delete" 
                      onClick={() => handleDelete(user._id)}
                    >
                      Delete
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

export default ManageUsers;
