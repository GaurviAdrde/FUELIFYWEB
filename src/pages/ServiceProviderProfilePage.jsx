import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-control-geocoder';
import 'leaflet-control-geocoder/dist/Control.Geocoder.css'; // Optional styling

import './ServiceProviderProfilePage.css';

const ServiceProviderProfilePage = () => {
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  const [companyName, setCompanyName] = useState('');
  const [servicesOffered, setServicesOffered] = useState([]);
  const [contactNumber, setContactNumber] = useState('');
  const [location, setLocation] = useState('');
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [isProfileExists, setIsProfileExists] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/profile/service-provider', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const profile = response.data;
        setCompanyName(profile.company_name);
        setServicesOffered(profile.services_offered.split(',').map(s => s.trim()));
        setContactNumber(profile.contact_number);
        setLocation(profile.location);
        setLatitude(profile.latitude);
        setLongitude(profile.longitude);
        setIsProfileExists(true);
      } catch (error) {
        setIsProfileExists(false);
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    if (mapRef.current) return; // Prevent map from re-initializing

    const initialLat = latitude || 28.6139;
    const initialLng = longitude || 77.2090;

    const map = L.map('provider-map').setView([initialLat, initialLng], 12);
    mapRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    if (latitude && longitude) {
      markerRef.current = L.marker([latitude, longitude]).addTo(map);
    }

    const geocoder = L.Control.Geocoder.nominatim();
    L.Control.geocoder({
      defaultMarkGeocode: false,
      geocoder
    })
      .on('markgeocode', function (e) {
        const { lat, lng } = e.geocode.center;

        setLatitude(lat);
        setLongitude(lng);
        setLocation(e.geocode.name);

        if (markerRef.current) {
          map.removeLayer(markerRef.current);
        }

        markerRef.current = L.marker([lat, lng]).addTo(map);
        map.setView([lat, lng], 13);
      })
      .addTo(map);
  }, [latitude, longitude]);

  const handleMultiSelect = (value) => {
    setServicesOffered(prev =>
      prev.includes(value)
        ? prev.filter(item => item !== value)
        : [...prev, value]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const payload = {
      company_name: companyName,
      services_offered: servicesOffered.join(', '),
      contact_number: contactNumber,
      location,
      latitude,
      longitude,
    };

    try {
      const url = 'http://localhost:5000/api/profile/service-provider';
      const method = isProfileExists ? 'put' : 'post';

      await axios[method](url, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessage(`Profile ${isProfileExists ? 'updated' : 'created'} successfully!`);
      setMessageType('success');

      setTimeout(() => navigate('/service'), 1500);
    } catch (error) {
      console.error('Error saving profile:', error);
      setMessage('Failed to save profile.');
      setMessageType('error');
    }
  };

  return (
    <div className="service-provider-profile-container">
      <h2>{isProfileExists ? 'Update' : 'Create'} Service Provider Profile</h2>
      <form className="service-provider-profile-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Company Name"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          required
        />

        <label>Services Offered:</label>
        <div className="checkbox-group">
          {['Fuel Refill', 'Breakdown Service', 'Mechanic Service'].map((option) => (
            <label key={option} className="checkbox-option">
              <input
                type="checkbox"
                value={option}
                checked={servicesOffered.includes(option)}
                onChange={() => handleMultiSelect(option)}
              />
              {option}
            </label>
          ))}
        </div>

        <input
          type="text"
          placeholder="Contact Number"
          value={contactNumber}
          onChange={(e) => setContactNumber(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />

        <div id="provider-map" className="map-container"></div>

        <div className="form-buttons">
          <button type="submit">{isProfileExists ? 'Update Profile' : 'Save Profile'}</button>
          <button type="button" className="cancel-button" onClick={() => navigate('/service')}>
            Cancel
          </button>
        </div>
      </form>

      {message && <div className={`message ${messageType}`}>{message}</div>}
    </div>
  );
};

export default ServiceProviderProfilePage;
