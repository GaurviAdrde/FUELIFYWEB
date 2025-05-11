import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./UserProfilePage.css";

const UserProfilePage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    full_name: "",
    phone_number: "",
    address: "",
    vehicle_type: "",
  });

  const [isEditing, setIsEditing] = useState(false); // true if profile already exists
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          "http://localhost:5000/api/profile/user",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data) {
          setFormData(response.data);
          setIsEditing(true); // Set to editing if data exists
        }
      } catch (error) {
        console.log("No existing profile or error fetching profile");
      }
    };

    fetchProfile();
  }, []);

  const validateForm = () => {
    const { full_name, phone_number, address } = formData;
    if (!full_name.trim() || !phone_number.trim() || !address.trim()) {
      setMessage("Full name, phone number, and address are required.");
      setMessageType("error");
      return false;
    }

    if (!/^\d{10}$/.test(phone_number)) {
      setMessage("Phone number must be 10 digits.");
      setMessageType("error");
      return false;
    }

    return true;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setMessage("");
    setMessageType("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const token = localStorage.getItem("token");
      const url = "http://localhost:5000/api/profile/user";

      const response = isEditing
        ? await axios.put(url, formData, {
            headers: { Authorization: `Bearer ${token}` },
          })
        : await axios.post(url, formData, {
            headers: { Authorization: `Bearer ${token}` },
          });

      setMessage(
        isEditing
          ? "Profile updated successfully!"
          : "Profile created successfully!"
      );
      setMessageType("success");

      setTimeout(() => {
        navigate("/user");
      }, 1500);
    } catch (error) {
      console.error("Error saving profile:", error);
      setMessage("Failed to save profile.");
      setMessageType("error");
    }
  };

  const handleCancel = () => {
    navigate("/user"); // 🚀 Redirect to the user dashboard if the user clicks cancel
  };

  return (
    <div className="user-profile-container">
      <h2>{isEditing ? "Edit Your Profile" : "Create Your Profile"}</h2>
      <form onSubmit={handleSubmit} className="user-profile-form">
        <input
          type="text"
          name="full_name"
          placeholder="Full Name"
          value={formData.full_name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="phone_number"
          placeholder="Phone Number"
          value={formData.phone_number}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="vehicle_type"
          placeholder="Vehicle Type (optional)"
          value={formData.vehicle_type}
          onChange={handleChange}
        />
        <div className="form-buttons">
          <button type="submit">
            {isEditing ? "Update Profile" : "Save Profile"}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="cancel-button"
          >
            Cancel
          </button>
        </div>
      </form>

      {message && <div className={`message ${messageType}`}>{message}</div>}
    </div>
  );
};

export default UserProfilePage;
