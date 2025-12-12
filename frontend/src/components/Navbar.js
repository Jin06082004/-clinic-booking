import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { logout, isAuthenticated, user } = useAuth();

  const renderMenuByRole = () => {
    if (!isAuthenticated) {
      return (
        <>
          <li className="nav-item">
            <Link to="/clinics" className="nav-link">Phòng Khám</Link>
          </li>
          <li className="nav-item">
            <Link to="/login" className="nav-link">Đăng Nhập</Link>
          </li>
          <li className="nav-item">
            <Link to="/register" className="nav-link">Đăng Ký</Link>
          </li>
        </>
      );
    }

    // Admin Menu
    if (user.role === 'admin') {
      return (
        <>
          <li className="nav-item">
            <Link to="/admin/dashboard" className="nav-link">Bảng Điều Khiển</Link>
          </li>
          <li className="nav-item">
            <Link to="/clinics" className="nav-link">Phòng Khám</Link>
          </li>
          <li className="nav-item">
            <Link to="/profile" className="nav-link">Hồ Sơ</Link>
          </li>
          <li className="nav-item">
            <button onClick={logout} className="nav-link btn-link">Đăng Xuất</button>
          </li>
        </>
      );
    }

    // Receptionist Menu
    if (user.role === 'receptionist') {
      return (
        <>
          <li className="nav-item">
            <Link to="/receptionist/dashboard" className="nav-link">Bảng Điều Khiển</Link>
          </li>
          <li className="nav-item">
            <Link to="/receptionist/new-booking" className="nav-link">Đặt Lịch Mới</Link>
          </li>
          <li className="nav-item">
            <Link to="/receptionist/queue" className="nav-link">Hàng Đợi</Link>
          </li>
          <li className="nav-item">
            <Link to="/receptionist/history" className="nav-link">Lịch Sử</Link>
          </li>
          <li className="nav-item">
            <Link to="/profile" className="nav-link">Hồ Sơ</Link>
          </li>
          <li className="nav-item">
            <button onClick={logout} className="nav-link btn-link">Đăng Xuất</button>
          </li>
        </>
      );
    }

    // User Menu (default)
    return (
      <>
        <li className="nav-item">
          <Link to="/clinics" className="nav-link">Phòng Khám</Link>
        </li>
        <li className="nav-item">
          <Link to="/history" className="nav-link">Lịch Hẹn Của Tôi</Link>
        </li>
        <li className="nav-item">
          <Link to="/profile" className="nav-link">Hồ Sơ</Link>
        </li>
        <li className="nav-item">
          <button onClick={logout} className="nav-link btn-link">Đăng Xuất</button>
        </li>
      </>
    );
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          Đặt Lịch Khám Bệnh
        </Link>
        <ul className="nav-menu">
          {renderMenuByRole()}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
