import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home">
      <div className="hero">
        <div className="hero-content">
          <h1>Chào mừng đến với Đặt Lịch Khám Bệnh</h1>
          <p>Tìm kiếm và đặt lịch khám với các phòng khám và bác sĩ uy tín gần bạn</p>
          <Link to="/clinics" className="btn btn-primary">
            Tìm Phòng Khám
          </Link>
        </div>
      </div>
      
      <div className="features">
        <h2>Tại Sao Chọn Chúng Tôi?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>Đặt Lịch Dễ Dàng</h3>
            <p>Đặt lịch hẹn chỉ với vài cú nhấp chuột</p>
          </div>
          <div className="feature-card">
            <h3>Phòng Khám Uy Tín</h3>
            <p>Tất cả phòng khám và bác sĩ đều được xác minh chuyên nghiệp</p>
          </div>
          <div className="feature-card">
            <h3>Quản Lý Lịch Hẹn</h3>
            <p>Xem và quản lý tất cả lịch hẹn của bạn ở một nơi</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
