import express from 'express';
import { getEvents, addEvent, updateEvent, deleteEvent } from '../controllers/eventsController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getEvents)
  .post(protect, upload.single('image'), addEvent);

router.route('/:id')
  .put(protect, upload.single('image'), updateEvent)
  .delete(protect, deleteEvent);

export default router;
