import express from 'express';
import { 
  submitDonation, 
  getDonations, 
  updateDonationStatus, 
  getApprovedDonors, 
  searchDonation 
} from '../controllers/donationManagerController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Public routes
router.post('/', upload.single('screenshot'), submitDonation);
router.get('/approved', getApprovedDonors);
router.get('/search', searchDonation);

// Private routes (Admin)
router.get('/', protect, getDonations);
router.put('/:id/status', protect, updateDonationStatus);

export default router;
