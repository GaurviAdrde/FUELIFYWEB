import React, { useEffect, useState } from 'react';
import './RequestStatus.css';

const RequestStatus = () => {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/service-requests/user', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error('Failed to fetch request statuses');
        }

        const data = await res.json();

        // Filter only requests with pending, accepted, in_progress
        const activeStatuses = ['pending', 'accepted', 'in_progress'];
        const filteredRequests = data.filter((req) =>
          activeStatuses.includes(req.status)
        );

        setRequests(filteredRequests);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchRequests();
  }, []);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'status-badge pending';
      case 'accepted':
        return 'status-badge accepted';
      case 'in_progress':
        return 'status-badge in-progress';
      default:
        return 'status-badge unknown';
    }
  };

  return (
    <div className="request-status">
      <h2>Track Service Request Status</h2>
      {error && <p className="error">{error}</p>}
      {requests.length === 0 ? (
        <p>No active service requests found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Type</th>
              <th>Location</th>
              <th>Description</th>
              <th>Status</th>
              <th>Requested On</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req.id}>
                <td>{req.service_type}</td>
                <td>{req.location}</td>
                <td>{req.description}</td>
                <td>
                  <span className={getStatusColor(req.status)}>
                    {req.status}
                  </span>
                </td>
                <td>{new Date(req.requested_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default RequestStatus;
