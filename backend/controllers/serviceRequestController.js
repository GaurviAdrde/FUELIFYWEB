// backend/controllers/serviceRequestController.js

import mysql from 'mysql2';

// MySQL Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'hellouser',
  database: 'fuelify_db',
});

// ------------------ CREATE SERVICE REQUEST ------------------

export const createServiceRequest = (req, res) => {
  const { service_type, location, description, service_provider_id } = req.body;
  const userId = req.user.id;

  if (!service_type || !location || !service_provider_id) {
    return res.status(400).json({ error: 'Service type, location, and provider are required' });
  }

  const insertQuery = `
    INSERT INTO service_requests (user_id, service_type, location, description, status, service_provider_id)
    VALUES (?, ?, ?, ?, 'pending', ?)
  `;

  db.query(insertQuery, [userId, service_type, location, description, service_provider_id], (err, result) => {
    if (err) {
      console.error('Error creating service request:', err);
      return res.status(500).json({ error: 'Failed to create service request' });
    }

    return res.status(201).json({ message: 'Service request submitted successfully' });
  });
};

// ------------------ GET USER SERVICE REQUESTS ------------------

export const getUserServiceRequests = (req, res) => {
  const userId = req.user.id;

  const query = `
    SELECT 
      id, 
      service_type, 
      location,
      description, 
      status, 
      requested_at,
      service_provider_id
    FROM service_requests 
    WHERE user_id = ? 
    ORDER BY requested_at DESC
  `;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching service requests:', err);
      return res.status(500).json({ error: 'Failed to fetch service requests' });
    }

    return res.status(200).json(results);
  });
};

// ------------------ UPDATE STATUS OF SERVICE REQUEST ------------------

export const updateServiceRequestStatus = (req, res) => {
  const requestId = req.params.id;
  const { status } = req.body;

  const allowedStatuses = ['pending', 'accepted', 'in_progress', 'completed', 'cancelled'];
  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status value' });
  }

  const updateQuery = `
    UPDATE service_requests 
    SET status = ? 
    WHERE id = ?
  `;

  db.query(updateQuery, [status, requestId], (err, result) => {
    if (err) {
      console.error('Error updating request status:', err);
      return res.status(500).json({ error: 'Failed to update status' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Service request not found' });
    }

    return res.status(200).json({ message: 'Status updated successfully' });
  });
};







// ------------------  CREATE/UPDATE REVIEW  ----------------------------

// CREATE/UPDATE REVIEW
export const submitReview = (req, res) => {
  const userId = req.user.id;
  const { request_id, rating, review } = req.body;

  // Validation
  if (!request_id || !rating || !review) {
    return res.status(400).json({ error: "All fields are required." });
  }

  // Step 1: Get service_provider_profiles.user_id from the request_id
  const fetchProviderQuery = `
    SELECT spp.user_id AS provider_user_id
    FROM service_requests sr
    JOIN service_provider_profiles spp ON sr.service_provider_id = spp.id
    WHERE sr.id = ?
  `;

  db.query(fetchProviderQuery, [request_id], (err, results) => {
    if (err) {
      console.error("Database error (provider lookup):", err);
      return res.status(500).json({ error: "Failed to retrieve provider info" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Service request or provider not found" });
    }

    const providerUserId = results[0].provider_user_id;

    // Step 2: Check if a review already exists
    const checkQuery = `SELECT * FROM reviews WHERE request_id = ? AND user_id = ?`;

    db.query(checkQuery, [request_id, userId], (err, reviewResults) => {
      if (err) {
        console.error("Database error (check):", err);
        return res.status(500).json({ error: "Database error" });
      }

      if (reviewResults.length > 0) {
        // Update existing review
        const updateQuery = `UPDATE reviews SET rating = ?, review = ? WHERE request_id = ? AND user_id = ?`;
        db.query(updateQuery, [rating, review, request_id, userId], (err) => {
          if (err) {
            console.error("Database error (update):", err);
            return res.status(500).json({ error: "Failed to update review" });
          }
          return res.status(200).json({ message: "Review updated" });
        });
      } else {
        // Insert new review
        const insertQuery = `
          INSERT INTO reviews (request_id, user_id, service_provider_id, rating, review)
          VALUES (?, ?, ?, ?, ?)
        `;
        db.query(insertQuery, [request_id, userId, providerUserId, rating, review], (err) => {
          if (err) {
            console.error("Insert review SQL error:", err);
            return res.status(500).json({ error: "Failed to submit review" });
          }
          return res.status(201).json({ message: "Review submitted" });
        });
      }
    });
  });
};



// ------------------  GET REVIEW FOR A REQUEST  ----------------------------

// GET REVIEW FOR A REQUEST
export const getReviewByRequestId = (req, res) => {
  const requestId = req.params.id;

  // Validate if requestId is present
  if (!requestId) {
    return res.status(400).json({ error: "Service request ID is required" });
  }

  const query = `SELECT rating, review, provider_reply FROM reviews WHERE request_id = ?`;

  db.query(query, [requestId], (err, results) => {
    if (err) return res.status(500).json({ error: "Failed to fetch review" });

    if (results.length === 0) {
      return res.status(200).json(null); // No review yet
    }

    return res.status(200).json(results[0]);
  });
};








