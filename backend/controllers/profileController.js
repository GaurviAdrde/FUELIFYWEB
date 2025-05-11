// backend/controllers/profileController.js

import mysql from 'mysql2';

// MySQL Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'hellouser',
  database: 'fuelify_db',
});

// -------------------- USER PROFILE ------------------------

// Create user profile
export const createUserProfile = (req, res) => {
  const { full_name, address, phone_number, vehicle_type } = req.body;
  const userId = req.user.id;

  const insertQuery = `
    INSERT INTO user_profiles (user_id, full_name, address, phone_number, vehicle_type)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(insertQuery, [userId, full_name, address, phone_number, vehicle_type], (err) => {
    if (err) {
      console.error('Error creating user profile:', err);
      return res.status(500).json({ error: 'Failed to create user profile' });
    }
    res.status(201).json({ message: 'User profile created successfully' });
  });
};

// Get user profile
export const getUserProfile = (req, res) => {
  const userId = req.user.id;

  db.query(`SELECT * FROM user_profiles WHERE user_id = ?`, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching user profile:', err);
      return res.status(500).json({ error: 'Failed to fetch user profile' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'User profile not found' });
    }

    return res.status(200).json(results[0]);
  });
};

// Update user profile
export const updateUserProfile = (req, res) => {
  const { full_name, address, phone_number, vehicle_type } = req.body;
  const userId = req.user.id;

  const updateQuery = `
    UPDATE user_profiles 
    SET full_name = ?, address = ?, phone_number = ?, vehicle_type = ? 
    WHERE user_id = ?
  `;

  db.query(updateQuery, [full_name, address, phone_number, vehicle_type, userId], (err, result) => {
    if (err) {
      console.error('Error updating user profile:', err);
      return res.status(500).json({ error: 'Failed to update user profile' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User profile not found' });
    }

    res.status(200).json({ message: 'User profile updated successfully' });
  });
};

// -------------------- SERVICE PROVIDER PROFILE ------------------------

// Create service provider profile
export const createServiceProviderProfile = (req, res) => {
  const { company_name, services_offered, contact_number, location, latitude, longitude } = req.body;
  const userId = req.user.id;

  const insertQuery = `
    INSERT INTO service_provider_profiles (user_id, company_name, services_offered, contact_number, location, latitude, longitude)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(insertQuery, [userId, company_name, services_offered, contact_number, location, latitude, longitude], (err) => {
    if (err) {
      console.error('Error creating provider profile:', err);
      return res.status(500).json({ error: 'Failed to create service provider profile' });
    }
    res.status(201).json({ message: 'Service provider profile created successfully' });
  });
};




// Get service provider profile
export const getServiceProviderProfile = (req, res) => {
  const userId = req.user.id;

  const query = `SELECT * FROM service_provider_profiles WHERE user_id = ?`;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching provider profile:', err);
      return res.status(500).json({ error: 'Failed to fetch profile' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.status(200).json(results[0]);
  });
};



// Update service provider profile
export const updateServiceProviderProfile = (req, res) => {
  const { company_name, services_offered, contact_number, location, latitude, longitude } = req.body;
  const userId = req.user.id;

  const updateQuery = `
    UPDATE service_provider_profiles
    SET company_name = ?, services_offered = ?, contact_number = ?, location = ?, latitude = ?, longitude = ?
    WHERE user_id = ?
  `;

  db.query(updateQuery, [company_name, services_offered, contact_number, location, latitude, longitude, userId], (err, result) => {
    if (err) {
      console.error('Error updating provider profile:', err);
      return res.status(500).json({ error: 'Failed to update profile' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.status(200).json({ message: 'Profile updated successfully' });
  });
};





// -------------------- GET NEARBY FUEL PROVIDERS ------------------------

export const getNearbyFuelProviders = (req, res) => {
  const { lat, lng, service_type } = req.query;

  if (!lat || !lng || !service_type) {
    return res.status(400).json({ error: 'Latitude, longitude, and service type are required' });
  }

  const radiusInKm = 10;
  const latFloat = parseFloat(lat);
  const lngFloat = parseFloat(lng);

  const query = `
    SELECT id, user_id, company_name, contact_number, location, latitude, longitude
    FROM service_provider_profiles
    WHERE LOWER(services_offered) LIKE ?
    AND (
      6371 * acos(
        cos(radians(?)) *
        cos(radians(latitude)) *
        cos(radians(longitude) - radians(?)) +
        sin(radians(?)) *
        sin(radians(latitude))
      )
    ) <= ?
  `;

  const serviceKeyword = `%${service_type.toLowerCase()}%`;

  db.query(query, [serviceKeyword, latFloat, lngFloat, latFloat, radiusInKm], (err, results) => {
    if (err) {
      console.error('Error fetching nearby providers:', err);
      return res.status(500).json({ error: 'Failed to fetch nearby providers' });
    }

    res.status(200).json(results);
  });
};
