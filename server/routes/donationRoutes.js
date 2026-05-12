import express from 'express';
import { getDonationInfo, updateDonationInfo } from '../controllers/donationController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.route('/info')
  .get(getDonationInfo)
  .put(protect, upload.single('qrImage'), updateDonationInfo);

export default router;
