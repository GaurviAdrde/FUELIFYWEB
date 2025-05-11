import express from 'express';
import { register, login } from '../controllers/authController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

// Register route
router.post('/register', register);

// Login route
router.post('/login', login);

// Protected profile route
router.get('/profile', authenticate, (req, res) => {
  res.json({
    message: 'Welcome to your profile!',
    user: req.user
  });
});

export default router;
