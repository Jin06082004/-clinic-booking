import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const ManageClinics = () => {
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingClinic, setEditingClinic] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    city: '',
    phone: '',
    email: '',
    specialties: '',
  });

  useEffect(() => {
    fetchClinics();
  }, []);

  const fetchClinics = async () => {
    try {
      setLoading(true);
      const response = await api.get('/clinics');
      setClinics(response.data);
    } catch (error) {
      console.error('Thất bại khi fetch clinics', error);
      alert('Tải danh sách phòng khám thất bại');
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
      const clinicData = {
        ...formData,
        specialties: formData.specialties.split(',').map(s => s.trim()),
      };

      if (editingClinic) {
        await api.put(`/clinics/${editingClinic._id}`, clinicData);
        alert('Cập nhật phòng khám thành công');
      } else {
        await api.post('/clinics', clinicData);
        alert('Tạo phòng khám thành công');
      }

      setShowModal(false);
      resetForm();
      fetchClinics();
    } catch (error) {
      console.error('Error saving clinic', error);
      alert(error.response?.data?.message || 'Lưu phòng khám thất bại');
    }
  };

  const handleEdit = (clinic) => {
    setEditingClinic(clinic);
    setFormData({
      name: clinic.name,
      description: clinic.description,
      address: clinic.address,
      city: clinic.city,
      phone: clinic.phone,
      email: clinic.email,
      specialties: clinic.specialties.join(', '),
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa phòng khám này?')) {
      return;
    }

    try {
      await api.delete(`/clinics/${id}`);
      alert('Xóa phòng khám thành công');
      fetchClinics();
    } catch (error) {
      console.error('Error deleting clinic', error);
      alert('Xóa phòng khám thất bại');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      address: '',
      city: '',
      phone: '',
      email: '',
      specialties: '',
    });
    setEditingClinic(null);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };

  if (loading) return <div className="loading">Đang tải phòng khám...</div>;

  return (
    <div className="manage-page">
      <div className="page-header">
        <h1>Quản Lý Phòng Khám</h1>
        <button 
          className="btn btn-primary" 
          onClick={() => setShowModal(true)}
        >
          + Thêm Phòng Khám Mới
        </button>
      </div>

      <div className="data-table">
        <table>
          <thead>
            <tr>
              <th>Tên Phòng Khám</th>
              <th>Thành Phố</th>
              <th>SĐT</th>
              <th>Email</th>
              <th>Chuyên Khoa</th>
              <th>Đánh Giá</th>
              <th>Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {clinics.map((clinic) => (
              <tr key={clinic._id}>
                <td>{clinic.name}</td>
                <td>{clinic.city}</td>
                <td>{clinic.phone}</td>
                <td>{clinic.email}</td>
                <td>
                  <div className="specialties-list">
                    {clinic.specialties.slice(0, 2).join(', ')}
                    {clinic.specialties.length > 2 && '...'}
                  </div>
                </td>
                <td>⭐ {clinic.rating || 'N/A'}</td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className="btn btn-sm btn-edit" 
                      onClick={() => handleEdit(clinic)}
                    >
                      Sửa
                    </button>
                    <button 
                      className="btn btn-sm btn-delete" 
                      onClick={() => handleDelete(clinic._id)}
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

      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingClinic ? 'Chỉnh Sửa Phòng Khám' : 'Thêm Phòng Khám Mới'}</h2>
              <button className="close-btn" onClick={handleCloseModal}>×</button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Tên Phòng Khám *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Mô Tả *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows="3"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Địa Chỉ *</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Thành Phố *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Số Điện Thoại *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>

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
              </div>

              <div className="form-group">
                <label>Chuyên Khoa (phân cách bằng dấu phẩy) *</label>
                <input
                  type="text"
                  name="specialties"
                  value={formData.specialties}
                  onChange={handleInputChange}
                  placeholder="Ví dụ: Tim Mạch, Chấn Thương Chỉnh Hình, Nhi Khoa"
                  required
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                  Hủy
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingClinic ? 'Cập Nhật' : 'Tạo Mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageClinics;
