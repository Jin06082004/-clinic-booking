import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { clinicService } from '../services/api';
import { getSafeImageUrl } from '../utils/helpers';

const Clinics = () => {
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    city: '',
    specialty: '',
  });

  useEffect(() => {
    fetchClinics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const fetchClinics = async () => {
    try {
      setLoading(true);
      const response = await clinicService.getAll(filters);
      setClinics(response.data);
    } catch (err) {
      setError('Failed to load clinics');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="clinics-page">
      <div className="page-header">
        <h1>Find Clinics</h1>
        <div className="filters">
          <input
            type="text"
            name="city"
            placeholder="Search by city"
            value={filters.city}
            onChange={handleFilterChange}
            className="filter-input"
          />
          <input
            type="text"
            name="specialty"
            placeholder="Search by specialty"
            value={filters.specialty}
            onChange={handleFilterChange}
            className="filter-input"
          />
        </div>
      </div>

      {loading && <div className="loading">Loading clinics...</div>}
      {error && <div className="error-message">{error}</div>}

      <div className="clinics-grid">
        {clinics.map((clinic) => (
          <div key={clinic._id} className="clinic-card">
            <img src={getSafeImageUrl(clinic.image)} alt={clinic.name} />
            <div className="clinic-info">
              <h3>{clinic.name}</h3>
              <p className="clinic-city">{clinic.city}</p>
              <p className="clinic-description">{clinic.description}</p>
              <div className="clinic-specialties">
                {clinic.specialties.map((specialty, index) => (
                  <span key={index} className="specialty-tag">
                    {specialty}
                  </span>
                ))}
              </div>
              <div className="clinic-rating">
                Rating: {clinic.rating.toFixed(1)} ⭐
              </div>
              <Link to={`/clinics/${clinic._id}`} className="btn btn-primary">
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>

      {!loading && clinics.length === 0 && (
        <div className="no-results">No clinics found</div>
      )}
    </div>
  );
};

export default Clinics;
