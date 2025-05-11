import { useState } from 'react';
import './OrderManagement.css';

function OrderManagement() {
  const [openSection, setOpenSection] = useState(null);

  const dummyOrders = [
    { id: 1, customer: 'John Doe', service: 'Fuel Refill', status: 'New' },
    { id: 2, customer: 'Jane Smith', service: 'Battery Jumpstart', status: 'Pending' },
    { id: 3, customer: 'Mike Johnson', service: 'Towing', status: 'Approved' },
  ];

  const toggleSection = (section) => {
    if (openSection === section) {
      setOpenSection(null); // Close if already open
    } else {
      setOpenSection(section); // Open new
    }
  };

  return (
    <div className="order-management-container">
      <h2>Order Management</h2>

      <div className="order-card" onClick={() => toggleSection('newOrders')}>
        <h3>New Orders</h3>
        <p>View and manage newly placed orders.</p>
        {openSection === 'newOrders' && (
          <div className="order-table-container">
            <table className="order-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Service</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {dummyOrders.map(order => (
                  <tr key={order.id}>
                    <td>#{order.id}</td>
                    <td>{order.customer}</td>
                    <td>{order.service}</td>
                    <td>{order.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="order-card" onClick={() => toggleSection('pendingApprovals')}>
        <h3>Pending Approvals</h3>
        <p>Review and approve pending service requests.</p>
        {openSection === 'pendingApprovals' && (
          <div className="order-table-container">
            <table className="order-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Service</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {dummyOrders.map(order => (
                  <tr key={order.id}>
                    <td>#{order.id}</td>
                    <td>{order.customer}</td>
                    <td>{order.service}</td>
                    <td>{order.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="order-card" onClick={() => toggleSection('orderHistory')}>
        <h3>Order History</h3>
        <p>Track completed and past service orders.</p>
        {openSection === 'orderHistory' && (
          <div className="order-table-container">
            <table className="order-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Service</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {dummyOrders.map(order => (
                  <tr key={order.id}>
                    <td>#{order.id}</td>
                    <td>{order.customer}</td>
                    <td>{order.service}</td>
                    <td>{order.status}</td>
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

export default OrderManagement;
