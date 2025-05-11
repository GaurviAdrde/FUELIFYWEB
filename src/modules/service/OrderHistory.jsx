import React, { useEffect, useState } from 'react';
import './OrderHistory.css';

function OrderHistory() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/service-requests/completed', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch completed orders');
        }

        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="order-history">
      <h2>Order History</h2>
      <p>Track your completed service requests here.</p>
      <div className="order-table">
        <div className="order-table-header">
          <span>User Name</span>
          <span>Service Type</span>
          <span>Status</span>
          <span>Completed Date</span>
        </div>
        {orders.map((order) => (
          <div className="order-table-row" key={order.id}>
            <span>{order.user_name}</span>
            <span>{order.service_type}</span>
            <span className={`status ${order.status.toLowerCase()}`}>{order.status}</span>
            <span>{new Date(order.completed_at).toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OrderHistory;
