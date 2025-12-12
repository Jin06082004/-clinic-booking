import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { formatDateForInput } from '../utils/helpers';

const Booking = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    clinic: searchParams.get('clinic') || '',
    doctor: searchParams.get('doctor') || '',
    date: '',
    time: '',
    symptoms: '',
  });
  const [clinics, setClinics] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [selectedClinic, setSelectedClinic] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      fetchClinics();
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (formData.clinic) {
      fetchDoctorsByClinic(formData.clinic);
      const clinic = clinics.find(c => c._id === formData.clinic);
      setSelectedClinic(clinic);
    }
  }, [formData.clinic, clinics]);

  useEffect(() => {
    if (formData.doctor) {
      const doctor = doctors.find(d => d._id === formData.doctor);
      setSelectedDoctor(doctor);
      fetchSchedules(formData.doctor);
    }
  }, [formData.doctor, doctors]);

  const fetchClinics = async () => {
    try {
      const response = await api.get('/clinics');
      setClinics(response.data);
    } catch (err) {
      console.error('Thất bại khi fetch clinics');
    }
  };

  const fetchDoctorsByClinic = async (clinicId) => {
    try {
      const response = await api.get(`/doctors?clinic=${clinicId}`);
      setDoctors(response.data);
    } catch (err) {
      console.error('Thất bại khi fetch doctors');
    }
  };

  const fetchSchedules = async (doctorId) => {
    try {
      const response = await api.get(`/schedules?doctor=${doctorId}`);
      setSchedules(response.data);
    } catch (error) {
      console.error('Thất bại khi fetch schedules', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Reset dependent fields when clinic changes
    if (name === 'clinic') {
      setFormData(prev => ({
        ...prev,
        clinic: value,
        doctor: '',
        date: '',
        time: '',
      }));
      setDoctors([]);
      setSelectedDoctor(null);
      setSchedules([]);
    }

    // Reset time when doctor changes
    if (name === 'doctor') {
      setFormData(prev => ({
        ...prev,
        doctor: value,
        time: '',
      }));
    }
  };

  const getAvailableTimeSlots = () => {
    if (!formData.date || schedules.length === 0) return [];

    const selectedDate = new Date(formData.date);
    const dayOfWeek = selectedDate.toLocaleDateString('en-US', { weekday: 'long' });
    
    const schedule = schedules.find(s => s.dayOfWeek === dayOfWeek && s.isActive);
    if (!schedule) return [];

    const slots = [];
    const start = parseInt(schedule.startTime.split(':')[0]);
    const end = parseInt(schedule.endTime.split(':')[0]);
    
    for (let hour = start; hour < end; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    
    return slots;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await api.post('/bookings', formData);
      setSuccess('Booking created successfully!');
      setTimeout(() => {
        navigate('/history');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Thất bại khi create booking');
    } finally {
      setLoading(false);
    }
  };

  const timeSlots = getAvailableTimeSlots();

  return (
    <div className="booking-page">
      <div className="booking-container">
        <div className="booking-header">
          <h1>Đặt Lịch Hẹn</h1>
          <p>Thực hiện các bước dưới đây để đặt lịch khám bệnh</p>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <form onSubmit={handleSubmit} className="booking-form-wizard">
          {/* Step 1: Chọn Phòng Khám */}
          <div className="form-step">
            <div className="step-header">
              <span className="step-number">1</span>
              <h3>Chọn Phòng Khám</h3>
            </div>
            <div className="form-group">
              <select
                name="clinic"
                value={formData.clinic}
                onChange={handleChange}
                required
                className="select-input"
              >
                <option value="">Chọn phòng khám</option>
                {clinics.map((clinic) => (
                  <option key={clinic._id} value={clinic._id}>
                    {clinic.name} - {clinic.city}
                  </option>
                ))}
              </select>
            </div>
            {selectedClinic && (
              <div className="selected-info">
                <p><strong>Địa Chỉ:</strong> {selectedClinic.address}, {selectedClinic.city}</p>
                <p><strong>Phone:</strong> {selectedClinic.phone}</p>
              </div>
            )}
          </div>

          {/* Step 2: Chọn Bác Sĩ */}
          {formData.clinic && (
            <div className="form-step">
              <div className="step-header">
                <span className="step-number">2</span>
                <h3>Chọn Bác Sĩ</h3>
              </div>
              <div className="form-group">
                <select
                  name="doctor"
                  value={formData.doctor}
                  onChange={handleChange}
                  required
                  className="select-input"
                  disabled={!doctors.length}
                >
                  <option value="">Chọn bác sĩ</option>
                  {doctors.map((doctor) => (
                    <option key={doctor._id} value={doctor._id}>
                      {doctor.name} - {doctor.specialty}
                    </option>
                  ))}
                </select>
              </div>
              {selectedDoctor && (
                <div className="selected-info">
                  <p><strong>Specialty:</strong> {selectedDoctor.specialty}</p>
                  <p><strong>Trình Độ:</strong> {selectedDoctor.qualification}</p>
                  <p><strong>Kinh Nghiệm:</strong> {selectedDoctor.experience} năm</p>
                  <p><strong>Đánh Giá:</strong> ⭐ {selectedDoctor.rating || 'N/A'}</p>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Chọn Ngày & Giờ */}
          {formData.doctor && (
            <div className="form-step">
              <div className="step-header">
                <span className="step-number">3</span>
                <h3>Chọn Ngày & Giờ</h3>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Ngày Hẹn</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    min={formatDateForInput()}
                  />
                </div>

                <div className="form-group">
                  <label>Giờ Hẹn</label>
                  <select
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    required
                    disabled={!formData.date}
                  >
                    <option value="">Chọn giờ</option>
                    {timeSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                  {formData.date && timeSlots.length === 0 && (
                    <small className="error-text">Không có khung giờ trống cho ngày này</small>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Additional Information */}
          {formData.time && (
            <div className="form-step">
              <div className="step-header">
                <span className="step-number">4</span>
                <h3>Thông Tin Bổ Sung</h3>
              </div>
              <div className="form-group">
                <label>Mô tả tình trạng của bạn</label>
                <textarea
                  name="symptoms"
                  value={formData.symptoms}
                  onChange={handleChange}
                  placeholder="Please describe your symptoms or reason for visit..."
                  rows="4"
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          {formData.time && (
            <div className="form-actions">
              <button type="submit" className="btn btn-primary btn-large" disabled={loading}>
                {loading ? 'Booking...' : 'Confirm Appointment'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Booking;
