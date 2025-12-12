import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const ManageDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    specialty: '',
    qualification: '',
    experience: '',
    clinic: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [doctorsRes, clinicsRes] = await Promise.all([
        api.get('/doctors'),
        api.get('/clinics')
      ]);
      setDoctors(doctorsRes.data);
      setClinics(clinicsRes.data);
    } catch (error) {
      console.error('Thất bại khi fetch data', error);
      alert('Thất bại khi load data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingDoctor) {
        await api.put(`/doctors/${editingDoctor._id}`, formData);
        alert('Doctor updated successfully');
      } else {
        await api.post('/doctors', formData);
        alert('Doctor created successfully');
      }

      setShowModal(false);
      resetForm();
      fetchData();
    } catch (error) {
      console.error('Error saving doctor', error);
      alert(error.response?.data?.message || 'Thất bại khi save doctor');
    }
  };

  const handleEdit = (doctor) => {
    setEditingDoctor(doctor);
    setFormData({
      name: doctor.name,
      specialty: doctor.specialty,
      qualification: doctor.qualification,
      experience: doctor.experience,
      clinic: doctor.clinic?._id || '',
      email: doctor.email,
      phone: doctor.phone,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this doctor?')) {
      return;
    }

    try {
      await api.delete(`/doctors/${id}`);
      alert('Doctor deleted successfully');
      fetchData();
    } catch (error) {
      console.error('Error deleting doctor', error);
      alert('Thất bại khi delete doctor');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      specialty: '',
      qualification: '',
      experience: '',
      clinic: '',
      email: '',
      phone: '',
    });
    setEditingDoctor(null);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };

  if (loading) return <div className="loading">Loading doctors...</div>;

  return (
    <div className="manage-page">
      <div className="page-header">
        <h1>Quản Lý Bác Sĩ</h1>
        <button 
          className="btn btn-primary" 
          onClick={() => setShowModal(true)}
        >
          + Thêm Bác Sĩ Mới
        </button>
      </div>

      <div className="data-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Specialty</th>
              <th>Trình Độ</th>
              <th>Kinh Nghiệm</th>
              <th>Clinic</th>
              <th>Phone</th>
              <th>Đánh Giá</th>
              <th>Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((doctor) => (
              <tr key={doctor._id}>
                <td>{doctor.name}</td>
                <td>{doctor.specialty}</td>
                <td>{doctor.qualification}</td>
                <td>{doctor.experience} năm</td>
                <td>{doctor.clinic?.name || 'N/A'}</td>
                <td>{doctor.phone}</td>
                <td>⭐ {doctor.rating || 'N/A'}</td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className="btn btn-sm btn-edit" 
                      onClick={() => handleEdit(doctor)}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn btn-sm btn-delete" 
                      onClick={() => handleDelete(doctor._id)}
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

      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingDoctor ? 'Edit Doctor' : 'Thêm Bác Sĩ Mới'}</h2>
              <button className="close-btn" onClick={handleCloseModal}>×</button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Tên Bác Sĩ *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Specialty *</label>
                  <input
                    type="text"
                    name="specialty"
                    value={formData.specialty}
                    onChange={handleInputChange}
                    placeholder="e.g., Cardiology"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Trình Độ *</label>
                  <input
                    type="text"
                    name="qualification"
                    value={formData.qualification}
                    onChange={handleInputChange}
                    placeholder="e.g., MD, MBBS"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Kinh Nghiệm (năm) *</label>
                  <input
                    type="number"
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    min="0"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Clinic *</label>
                  <select
                    name="clinic"
                    value={formData.clinic}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Chọn Phòng Khám</option>
                    {clinics.map((clinic) => (
                      <option key={clinic._id} value={clinic._id}>
                        {clinic.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingDoctor ? 'Update' : 'Create'} Doctor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageDoctors;
