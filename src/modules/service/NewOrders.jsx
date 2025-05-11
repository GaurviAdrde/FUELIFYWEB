import React, { useState } from "react";
import "./NewOrders.css";

function NewOrders() {
  const [orders, setOrders] = useState([
    {
      id: 1,
      userName: "Amit Sharma",
      serviceType: "Fuel",
      location: "Sector 21, Gurgaon",
      status: "Pending",
    },
    {
      id: 2,
      userName: "Priya Verma",
      serviceType: "Mechanic",
      location: "Rajouri Garden, Delhi",
      status: "Pending",
    },
    {
      id: 3,
      userName: "Ravi Kumar",
      serviceType: "Breakdown",
      location: "Powai, Mumbai",
      status: "Pending",
    },
  ]);

  const handleStatusUpdate = (id, newStatus) => {
    const updatedOrders = orders.map((order) =>
      order.id === id ? { ...order, status: newStatus } : order
    );
    setOrders(updatedOrders);
  };

  return (
    <div className="new-orders-container">
      <h2>New Service Orders</h2>
      {orders.length === 0 ? (
        <p>No new orders.</p>
      ) : (
        <table className="orders-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Service Type</th>
              <th>Location</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.userName}</td>
                <td>{order.serviceType}</td>
                <td>{order.location}</td>
                <td>{order.status}</td>
                <td>
                  {order.status === "Pending" ? (
                    <>
                      <button
                        className="accept-btn"
                        onClick={() => handleStatusUpdate(order.id, "Accepted")}
                      >
                        Accept
                      </button>
                      <button
                        className="reject-btn"
                        onClick={() => handleStatusUpdate(order.id, "Rejected")}
                      >
                        Reject
                      </button>
                    </>
                  ) : (
                    <span>{order.status}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default NewOrders;
