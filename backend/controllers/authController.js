import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mysql from 'mysql2';


// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'hellouser',
  database: 'fuelify_db',
});

// JWT secret (hardcoded as per your preference)
const JWT_SECRET = 'your_secret_key';

// Register controller
export const register = (req, res) => {
  const { name, email, password, role } = req.body;

  // Prevent signup as admin
  if (role && role.toLowerCase() === 'admin') {
    return res.status(400).json({ error: 'Signup as admin is not allowed.' });
  }

  // Check if user already exists
  const checkUserQuery = 'SELECT * FROM users WHERE email = ?';
  db.query(checkUserQuery, [email], async (err, result) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (result.length > 0) return res.status(400).json({ error: 'User already exists' });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user with role
    const insertUserQuery = 'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)';
    db.query(insertUserQuery, [name, email, hashedPassword, role || 'user'], (err, result) => {
      if (err) return res.status(500).json({ error: 'Registration failed' });
      res.status(201).json({ message: 'User registered successfully' });
    });
  });
};

// Login controller
export const login = (req, res) => {
  const { email, password } = req.body;

  // Check if user exists
  const findUserQuery = 'SELECT * FROM users WHERE email = ?';
  db.query(findUserQuery, [email], async (err, result) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (result.length === 0) return res.status(401).json({ error: 'Invalid email or password' });

    const user = result[0];

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid email or password' });

    // Create JWT token with role included
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '1h' });

    res.json({ message: 'Login successful', token, role: user.role });
  });
};

// Protected Profile route - Only accessible by authenticated users
export const getProfile = (req, res) => {
  res.json({ message: 'Welcome to your profile!', user: req.user });
};
