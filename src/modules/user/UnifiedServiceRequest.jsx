import React, { useState, useEffect } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import "./UnifiedServiceRequest.css";

const UnifiedServiceRequest = () => {
  const [location, setLocation] = useState("");
  const [coords, setCoords] = useState([27.1767, 78.0081]); // default to Agra
  const [serviceType, setServiceType] = useState("");
  const [description, setDescription] = useState("");
  const [providers, setProviders] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setCoords([latitude, longitude]);
        try {
          const response = await axios.get(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          setLocation(response.data.display_name);
        } catch (err) {
          console.error("Reverse geocoding failed:", err);
        }
      },
      (err) => console.warn("Geolocation error:", err),
      { enableHighAccuracy: true }
    );
  }, []);

 const fetchProviders = async () => {
    if (!coords || !serviceType) {
      return alert("Location and service type required");
    }
    try {
      const [lat, lng] = coords;
      const res = await axios.get(`/api/profile/service-providers/nearby`, {
        params: { lat, lng, service_type: serviceType },
      });
  
      console.log("Backend response:", res.data); // ✅ Log response
  
      if (!Array.isArray(res.data)) {
        throw new Error("Invalid data format from server");
      }
  
      setProviders(res.data);
    } catch (err) {
      console.error("Error fetching providers:", err);
      alert("Failed to load nearby providers");
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!location || !serviceType || !selectedProvider) {
      return alert("Please complete the form and select a provider");
    }
  
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found. User is not authenticated.");
      return alert("You must be logged in to submit a request.");
    }
  
    try {
      const payload = {
        location,
        service_type: serviceType,
        description,
        service_provider_id: selectedProvider.id,
      };
  
      await axios.post("/api/service-requests", payload, {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ attach token
        },
      });
  
      alert("Request submitted successfully");
      setLocation("");
      setServiceType("");
      setDescription("");
      setSelectedProvider(null);
      setProviders([]);
    } catch (err) {
      console.error("Submission failed:", err);
      alert("Failed to submit service request");
    }
  };
  

  const ProviderMarkers = () => {

    if (!Array.isArray(providers)) {
      console.warn("Provider data is not an array", providers);
      return null;
    }
    
    const map = useMap();
    useEffect(() => {
      if (providers.length > 0) {
        map.setView(coords, 13);
      }
    }, [providers]);

    return (
      <>
        {providers.map((provider) => (
          <Marker
            key={provider.id}
            position={[provider.latitude, provider.longitude]}
            eventHandlers={{
              click: () => {
                setSelectedProvider(provider);
              },
            }}
          >
            <Popup>
              <strong>{provider.company_name}</strong>
              <br />
              {provider.location}
            </Popup>
          </Marker>
        ))}
      </>
    );
  };

  return (
    <div className="unified-service-wrapper">
      <h2 className="heading">Request a Service</h2>

      <div className="form-section">
        <form className="service-form" onSubmit={handleSubmit}>
          <label>
            Your Location:
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter your location"
              required
            />
          </label>

          <label>
            Service Type:
            <select
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value)}
              required
            >
              <option value="">Select a service</option>
              <option value="Fuel Refill">Fuel Refill</option>
              <option value="Mechanic Service">Mechanic Service</option>
              <option value="Breakdown Service">Breakdown Service</option>
            </select>
          </label>

          <label>
            Description (optional):
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your issue"
            />
          </label>

          <button type="button" onClick={fetchProviders}>
            Show Nearby Providers
          </button>

          {providers.length > 0 && (
            <div className="map-section" style={{ marginTop: "1rem" }}>
              <h3>Nearby Providers</h3>
              <MapContainer
                center={coords}
                zoom={13}
                scrollWheelZoom={true}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <ProviderMarkers />
                <Marker position={coords}>
                  <Popup>Your Location</Popup>
                </Marker>
              </MapContainer>
            </div>
          )}

          {selectedProvider && (
            <div className="provider-info" style={{ marginTop: "1rem" }}>
              <h4>Selected Provider:</h4>
              <p>
                <strong>Name:</strong> {selectedProvider.company_name}
              </p>
              <p>
                <strong>Location:</strong> {selectedProvider.location}
              </p>
              <p>
                <strong>Latitude:</strong> {selectedProvider.latitude}
              </p>
              <p>
                <strong>Longitude:</strong> {selectedProvider.longitude}
              </p>
            </div>
          )}

          <button type="submit" style={{ marginTop: "1rem" }}>
            Submit Request
          </button>
        </form>
      </div>
    </div>
  );
};

export default UnifiedServiceRequest;
