import express from 'express';
import {
  createUserProfile,
  getUserProfile,
  updateUserProfile,
  createServiceProviderProfile,
  updateServiceProviderProfile,
  getServiceProviderProfile,
  getNearbyFuelProviders
} from '../controllers/profileController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import verifyServiceProviderProfile from '../middleware/verifyServiceProviderProfile.js';

const router = express.Router();

// User profile management
router.post('/user', authenticate, createUserProfile);
router.get('/user', authenticate, getUserProfile);
router.put('/user', authenticate, updateUserProfile);

// Service provider profile management
router.post('/service-provider', authenticate, createServiceProviderProfile);
router.get('/service-provider', authenticate, getServiceProviderProfile);
router.put('/service-provider', authenticate, updateServiceProviderProfile);

// 👇 Use middleware for protected service provider-only routes
// Example: if you later add routes like:
router.get('/service-provider/orders', authenticate, verifyServiceProviderProfile, (req, res) => {
  res.json({ message: 'This is only accessible if profile exists' });
});

// Public: Get nearby fuel providers
router.get('/service-providers/nearby', getNearbyFuelProviders);

export default router;
