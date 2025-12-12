import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="admin-layout">
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <h2>Quản Trị Viên</h2>
          <button className="toggle-btn" onClick={toggleSidebar}>
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>
        
        <nav className="sidebar-nav">
          <NavLink to="/admin/dashboard" className="sidebar-link">
            <span className="icon">📊</span>
            {sidebarOpen && <span>Bảng Điều Khiển</span>}
          </NavLink>
          
          <NavLink to="/admin/clinics" className="sidebar-link">
            <span className="icon">🏥</span>
            {sidebarOpen && <span>Quản Lý Phòng Khám</span>}
          </NavLink>
          
          <NavLink to="/admin/doctors" className="sidebar-link">
            <span className="icon">👨‍⚕️</span>
            {sidebarOpen && <span>Quản Lý Bác Sĩ</span>}
          </NavLink>
          
          <NavLink to="/admin/users" className="sidebar-link">
            <span className="icon">👥</span>
            {sidebarOpen && <span>Quản Lý Người Dùng</span>}
          </NavLink>
          
          <NavLink to="/admin/bookings" className="sidebar-link">
            <span className="icon">📅</span>
            {sidebarOpen && <span>Tất Cả Lịch Hẹn</span>}
          </NavLink>
          
          <div className="sidebar-divider"></div>
          
          <NavLink to="/profile" className="sidebar-link">
            <span className="icon">⚙️</span>
            {sidebarOpen && <span>Cài Đặt</span>}
          </NavLink>
        </nav>
        
        <div className="sidebar-footer">
          {sidebarOpen && (
            <div className="user-info">
              <p className="user-name">{user?.name}</p>
              <p className="user-role">{user?.role === 'admin' ? 'Quản Trị Viên' : user?.role}</p>
            </div>
          )}
          <button onClick={logout} className="logout-btn">
            <span className="icon">🚪</span>
            {sidebarOpen && <span>Đăng Xuất</span>}
          </button>
        </div>
      </aside>
      
      <main className={`admin-main ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
