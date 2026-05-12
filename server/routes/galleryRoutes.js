import express from 'express';
import { getPhotos, addPhoto, deletePhoto, reorderPhotos } from '../controllers/galleryController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.route('/').get(getPhotos).post(protect, upload.array('images'), addPhoto);
router.route('/:id').delete(protect, deletePhoto);
router.route('/reorder').patch(protect, reorderPhotos);

export default router;
