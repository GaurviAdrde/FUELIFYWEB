import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link, Outlet } from "react-router-dom";
import axios from "axios";
import "./ServiceDashboard.css";

function ServiceDashboard() {
  const navigate = useNavigate();
  const [isProfileChecked, setIsProfileChecked] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);

  useEffect(() => {
    const checkProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get("http://localhost:5000/api/profile/service-provider", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data && response.data.company_name) {
          setHasProfile(true);
        } else {
          throw new Error("No profile found");
        }
      } catch (error) {
        alert("⚠️ Please create your profile before accessing the dashboard.");
        navigate("/service-provider-profile");
      } finally {
        setIsProfileChecked(true);
      }
    };

    checkProfile();
  }, [navigate]);

  if (!isProfileChecked) {
    return <div>Loading...</div>;
  }

  return (
    <div className="service-dashboard-container">
      <h1>Welcome to Service Provider Dashboard</h1>

      <div className="dashboard-actions">
        <button className="create-profile-button" onClick={() => navigate("/service-provider-profile")}>
          Create / Update Profile
        </button>
      </div>

      <div className="service-dashboard">
        <h2>Fuelify</h2>

        <nav className="service-nav">
          <Link to="/service/fleet-management">Fleet Management</Link> |{" "}
          <Link to="/service/new-orders">New Orders</Link> |{" "}
          <Link to="/service/order-history">Order History</Link> |{" "}
          <Link to="/service/service-feedback">Service Feedback</Link>
        </nav>

        <div className="service-routes">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default ServiceDashboard;
