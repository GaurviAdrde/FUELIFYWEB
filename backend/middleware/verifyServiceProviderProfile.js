import mysql from 'mysql2';

// Create a new DB connection or reuse your db connection (better to reuse if exported)
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'hellouser',
  database: 'fuelify_db',
});

const verifyServiceProviderProfile = (req, res, next) => {
  const userId = req.user.id;

  const query = 'SELECT * FROM service_provider_profiles WHERE user_id = ?';

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error checking provider profile:', err);
      return res.status(500).json({ error: 'Server error during profile verification' });
    }

    if (results.length === 0) {
      return res.status(403).json({ error: 'Access denied: Service provider profile not found' });
    }

    next();
  });
};

export default verifyServiceProviderProfile;
