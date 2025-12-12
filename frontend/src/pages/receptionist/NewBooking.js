import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const NewBooking = () => {
  const { user } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    patient: '',
    doctor: '',
    date: '',
    time: '',
    symptoms: '',
  });

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const clinicId = user.clinic?._id || user.clinic;
      const [doctorsRes, patientsRes] = await Promise.all([
        api.get(`/doctors?clinic=${clinicId}`),
        api.get('/auth/patients')
      ]);
      setDoctors(doctorsRes.data);
      setPatients(patientsRes.data);
    } catch (error) {
      console.error('Thất bại khi fetch data', error);
    } finally {
      setLoading(false);
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === 'doctor' && value) {
      fetchSchedules(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const clinicId = user.clinic?._id || user.clinic;
      await api.post('/bookings', {
        user: formData.patient,
        clinic: clinicId,
        doctor: formData.doctor,
        date: formData.date,
        time: formData.time,
        symptoms: formData.symptoms,
        status: 'confirmed', // Receptionist can directly confirm
      });
      alert('Booking created successfully');
      setFormData({
        patient: '',
        doctor: '',
        date: '',
        time: '',
        symptoms: '',
      });
      setSchedules([]);
    } catch (error) {
      console.error('Error creating booking', error);
      alert(error.response?.data?.message || 'Thất bại khi create booking');
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

  const timeSlots = getAvailableTimeSlots();

  if (loading) return <div className="loading">Đang tải...</div>;

  return (
    <div className="receptionist-page">
      <div className="page-header">
        <h1>Create Đặt Lịch Mới</h1>
      </div>

      <div className="booking-form-container">
        <form onSubmit={handleSubmit} className="booking-form">
          <div className="form-group">
            <label>Select Patient *</label>
            <select
              name="patient"
              value={formData.patient}
              onChange={handleInputChange}
              required
            >
              <option value="">Choose a patient</option>
              {patients.map((patient) => (
                <option key={patient._id} value={patient._id}>
                  {patient.name} - {patient.phone}
                </option>
              ))}
            </select>
            <small className="form-hint">
              Don't see the patient? <a href="/receptionist/register-patient">Register new patient</a>
            </small>
          </div>

          <div className="form-group">
            <label>Chọn Bác Sĩ *</label>
            <select
              name="doctor"
              value={formData.doctor}
              onChange={handleInputChange}
              required
            >
              <option value="">Choose a doctor</option>
              {doctors.map((doctor) => (
                <option key={doctor._id} value={doctor._id}>
                  {doctor.name} - {doctor.specialty}
                </option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Ngày *</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            <div className="form-group">
              <label>Giờ *</label>
              <select
                name="time"
                value={formData.time}
                onChange={handleInputChange}
                required
                disabled={!formData.date || !formData.doctor}
              >
                <option value="">Select time</option>
                {timeSlots.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Symptoms / Lý Do Khám for Visit</label>
            <textarea
              name="symptoms"
              value={formData.symptoms}
              onChange={handleInputChange}
              rows="4"
              placeholder="Describe symptoms or reason for appointment..."
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              Tạo Lịch Hẹn
            </button>
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={() => setFormData({
                patient: '',
                doctor: '',
                date: '',
                time: '',
                symptoms: '',
              })}
            >
              Clear Form
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewBooking;
