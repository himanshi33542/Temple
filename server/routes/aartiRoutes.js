import express from 'express';
import { getAartiSchedule, addAarti, updateAarti, deleteAarti } from '../controllers/aartiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getAartiSchedule)
  .post(protect, addAarti);

router.route('/:id')
  .put(protect, updateAarti)
  .delete(protect, deleteAarti);

export default router;
