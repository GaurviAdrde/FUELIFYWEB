import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link, Outlet } from "react-router-dom";
import "./UserDashboard.css";

function UserDashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch("http://localhost:5000/api/profile/user", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 404) {
          navigate("/user-profile");
        }
      } catch (error) {
        console.error("Error checking user profile:", error);
        navigate("/login");
      }
    };

    checkUserProfile();
  }, [navigate]);

  const handleCreateProfile = () => {
    navigate("/user-profile");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="user-dashboard-container">
      <h1>Welcome to User Dashboard</h1>

      <div className="dashboard-actions">
        <button className="create-profile-button" onClick={handleCreateProfile}>
          Create Your Profile
        </button>
        
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="user-dashboard">
        <aside className="sidebar">
          <h2>Fuelify</h2>
          <nav>
            <Link to="/user/request">Create Service Request</Link> |{" "}
            <Link to="/user/history">My Service Requests</Link> |{" "}
            <Link to="/user/status">Track Request Status</Link>
          </nav>
        </aside>

        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default UserDashboard;
