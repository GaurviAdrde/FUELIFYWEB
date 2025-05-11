import 'leaflet/dist/leaflet.css';
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

import './TrackAndStatus.css';

const TrackAndStatus = ({ hideHeading = false }) => {
  const [vehicles, setVehicles] = useState([]);

  const getVehicleIcon = (status) => {
    let iconUrl;
    if (status === "Active") {
      iconUrl = "https://maps.google.com/mapfiles/ms/icons/green-dot.png";
    } else if (status === "Under Maintenance") {
      iconUrl = "https://maps.google.com/mapfiles/ms/icons/yellow-dot.png";
    } else {
      iconUrl = "https://maps.google.com/mapfiles/ms/icons/red-dot.png";
    }
    return new L.Icon({
      iconUrl: iconUrl,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });
  };

  useEffect(() => {
    const fetchVehicleData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/vehicles');
        const data = await response.json();
        setVehicles(data);
      } catch (error) {
        console.error('Error fetching vehicles:', error);
      }
    };
    fetchVehicleData();
  }, []);

  return (
    <div className="track-status-wrapper">
      {!hideHeading && <h2 className="track-status-heading">Vehicle Tracking & Status</h2>}

      <div className="track-status-map-container">
        <MapContainer center={[40.7128, -74.006]} zoom={4} scrollWheelZoom={true}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          {vehicles.map((vehicle) => (
            <Marker
              key={vehicle.id}
              position={[vehicle.lat, vehicle.lng]}
              icon={getVehicleIcon(vehicle.status)}
            >
              <Popup>
                <div className="popup-content">
                  <h4>{vehicle.name}</h4>
                  <p><strong>Status:</strong> {vehicle.status}</p>
                  <p><strong>Latitude:</strong> {vehicle.lat}</p>
                  <p><strong>Longitude:</strong> {vehicle.lng}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default TrackAndStatus;
