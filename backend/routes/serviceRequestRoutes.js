// backend/routes/serviceRequestRoutes.js

import express from 'express';
import {
  createServiceRequest,
  getUserServiceRequests,
  updateServiceRequestStatus,
  submitReview, 
  getReviewByRequestId,
 
} from '../controllers/serviceRequestController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

// Create a new service request
router.post('/', authenticate, createServiceRequest);

// Get service requests for the logged-in user
router.get('/user', authenticate, getUserServiceRequests);

// Update the status of a service request by ID
router.patch('/:id/status', authenticate, updateServiceRequestStatus);

//write service review for each request
router.post("/reviews", authenticate, submitReview);
router.get("/reviews/:id", authenticate, getReviewByRequestId);




export default router;
