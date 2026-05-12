import express from 'express';
import { login, verify, setup, resetAdmin, changePassword } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', login);
router.get('/verify', protect, verify);
router.put('/profile', protect, changePassword);
router.post('/setup', setup);
router.get('/reset-admin', resetAdmin);

export default router;
