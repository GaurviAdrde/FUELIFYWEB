import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import serviceRequestRoutes from './routes/serviceRequestRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend access
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// Middleware
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'hellouser',
  database: 'fuelify_db'
});

db.connect((err) => {
  if (err) {
    console.error('MySQL connection error:', err);
  } else {
    console.log('MySQL connected');
  }
});




// Route usage
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/service-requests', serviceRequestRoutes);

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
