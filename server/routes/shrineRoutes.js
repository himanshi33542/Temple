import express from 'express';
import { getShrines, createShrine, updateShrine, deleteShrine } from '../controllers/shrineController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getShrines)
  .post(protect, upload.single('image'), createShrine);

router.route('/:id')
  .put(protect, upload.single('image'), updateShrine)
  .delete(protect, deleteShrine);

export default router;
