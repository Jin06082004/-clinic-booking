import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { clinicService, doctorService } from '../services/api';
import { getSafeImageUrl } from '../utils/helpers';

const ClinicDetail = () => {
  const { id } = useParams();
  const [clinic, setClinic] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchClinicData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchClinicData = async () => {
    try {
      setLoading(true);
      const [clinicRes, doctorsRes] = await Promise.all([
        clinicService.getById(id),
        doctorService.getAll({ clinic: id }),
      ]);
      setClinic(clinicRes.data);
      setDoctors(doctorsRes.data);
    } catch (err) {
      setError('Thất bại khi load clinic details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Đang tải...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!clinic) return <div className="error-message">Clinic not found</div>;

  return (
    <div className="clinic-detail">
      <div className="clinic-header">
        <img src={getSafeImageUrl(clinic.image)} alt={clinic.name} className="clinic-image" />
        <div className="clinic-header-info">
          <h1>{clinic.name}</h1>
          <p className="clinic-address">
            {clinic.address}, {clinic.city}
          </p>
          <p className="clinic-contact">
            Phone: {clinic.phone} | Email: {clinic.email}
          </p>
          <div className="clinic-rating">
            Đánh Giá: {clinic.rating.toFixed(1)} ⭐
          </div>
          <div className="clinic-specialties">
            {clinic.specialties.map((specialty, index) => (
              <span key={index} className="specialty-tag">
                {specialty}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="clinic-description">
        <h2>Giới Thiệu</h2>
        <p>{clinic.description}</p>
      </div>

      <div className="doctors-section">
        <h2>Our Doctors</h2>
        {doctors.length === 0 ? (
          <p>No doctors available at this clinic</p>
        ) : (
          <div className="doctors-grid">
            {doctors.map((doctor) => (
              <div key={doctor._id} className="doctor-card">
                <img src={getSafeImageUrl(doctor.image)} alt={doctor.name} />
                <div className="doctor-info">
                  <h3>{doctor.name}</h3>
                  <p className="doctor-specialty">{doctor.specialty}</p>
                  <p className="doctor-qualification">{doctor.qualification}</p>
                  <p className="doctor-experience">{doctor.experience} năm experience</p>
                  <div className="doctor-rating">
                    Đánh Giá: {doctor.rating.toFixed(1)} ⭐
                  </div>
                  <Link
                    to={`/booking?clinic=${clinic._id}&doctor=${doctor._id}`}
                    className="btn btn-primary"
                  >
                    Đặt Lịch Khám
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClinicDetail;
