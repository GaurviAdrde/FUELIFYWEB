import React, { useState } from 'react';
import './FleetManagement.css';

function FleetManagement() {
  const [vehicles, setVehicles] = useState([]);
  const [formData, setFormData] = useState({
    id: '',
    type: '',
    status: '',
    location: ''
  });
  const [showForm, setShowForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingIndex !== null) {
      // Edit existing
      const updated = [...vehicles];
      updated[editingIndex] = formData;
      setVehicles(updated);
      setEditingIndex(null);
    } else {
      // Add new
      setVehicles([...vehicles, formData]);
    }
    setFormData({ id: '', type: '', status: '', location: '' });
    setShowForm(false);
  };

  // Handle delete
  const handleDelete = (index) => {
    const updated = vehicles.filter((_, i) => i !== index);
    setVehicles(updated);
  };

  // Handle edit
  const handleEdit = (index) => {
    setFormData(vehicles[index]);
    setEditingIndex(index);
    setShowForm(true);
  };

  return (
    <div className="service-fleet-management">
      <h2>Fleet Management</h2>
      <p>Register and manage your service vehicles.</p>

      <div className="fleet-actions">
        <button onClick={() => {
          setFormData({ id: '', type: '', status: '', location: '' });
          setEditingIndex(null);
          setShowForm(true);
        }}>
          Add New Vehicle
        </button>
      </div>

      {/* Vehicle Table */}
      <table className="fleet-table">
        <thead>
          <tr>
            <th>Vehicle ID</th>
            <th>Type</th>
            <th>Status</th>
            <th>Location</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {vehicles.length === 0 ? (
            <tr><td colSpan="5">No vehicles added yet.</td></tr>
          ) : (
            vehicles.map((vehicle, index) => (
              <tr key={index}>
                <td>{vehicle.id}</td>
                <td>{vehicle.type}</td>
                <td>{vehicle.status}</td>
                <td>{vehicle.location}</td>
                <td>
                  <button onClick={() => handleEdit(index)}>Edit</button>{" "}
                  <button onClick={() => handleDelete(index)}>Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="vehicle-form">
          <h3>{editingIndex !== null ? 'Edit Vehicle' : 'Add New Vehicle'}</h3>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="id"
              placeholder="Vehicle ID"
              value={formData.id}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="type"
              placeholder="Vehicle Type"
              value={formData.type}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="status"
              placeholder="Status"
              value={formData.status}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="location"
              placeholder="Location"
              value={formData.location}
              onChange={handleChange}
              required
            />
            <div className="form-buttons">
              <button type="submit">{editingIndex !== null ? 'Update' : 'Add'}</button>
              <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default FleetManagement;
