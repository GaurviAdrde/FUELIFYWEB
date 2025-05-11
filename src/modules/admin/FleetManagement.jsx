import { useState } from "react";
import TrackAndStatus from "../../components/TrackAndStatus"; // Import the TrackAndStatus component

import "./FleetManagement.css";

function FleetManagement() {
  const [openSection, setOpenSection] = useState(null);

  const dummyVehicles = [
    { id: 1, name: "Vehicle 001", status: "Active", location: "New York" },
    {
      id: 2,
      name: "Vehicle 002",
      status: "Under Maintenance",
      location: "Los Angeles",
    },
    { id: 3, name: "Vehicle 003", status: "Inactive", location: "Chicago" },
  ];

  const toggleSection = (section) => {
    if (openSection === section) {
      setOpenSection(null); // Close if already open
    } else {
      setOpenSection(section); // Open new
    }
  };

  return (
    <div className="fleet-management-container">
      <h2>Fleet Management</h2>

      {/* Track Vehicles Section */}
      <div
        className="fleet-card"
        onClick={() => toggleSection("trackVehicles")}
      >
        <h3>Track Vehicles</h3>
        <p>Monitor the status and location of the vehicles in your fleet.</p>
        {openSection === "trackVehicles" && (
          //Include the TrackAndStatus component here
          <div onClick={(e) => e.stopPropagation()}>
            <TrackAndStatus hideHeading={true} />
          </div>
        )}
      </div>

      {/* Vehicle Status Section */}
      <div
        className="fleet-card"
        onClick={() => toggleSection("vehicleStatus")}
      >
        <h3>Vehicle Status</h3>
        <p>
          Check the operational status of each vehicle and schedule maintenance
          if needed.
        </p>
        {openSection === "vehicleStatus" && (
          <div className="fleet-table-container">
            <table className="fleet-table">
              <thead>
                <tr>
                  <th>Vehicle ID</th>
                  <th>Vehicle Name</th>
                  <th>Status</th>
                  <th>Location</th>
                </tr>
              </thead>
              <tbody>
                {dummyVehicles.map((vehicle) => (
                  <tr key={vehicle.id}>
                    <td>#{vehicle.id}</td>
                    <td>{vehicle.name}</td>
                    <td>{vehicle.status}</td>
                    <td>{vehicle.location}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default FleetManagement;
