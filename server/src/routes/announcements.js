import express from 'express';
import {
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement
} from '../controllers/announcementController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { validateAnnouncement } from '../middleware/validation.js';

const router = express.Router();

router.get('/', authenticateToken, getAnnouncements);
router.post('/', authenticateToken, requireRole(['admin', 'manager']), validateAnnouncement, createAnnouncement);
router.put('/:id', authenticateToken, requireRole(['admin', 'manager']), updateAnnouncement);
router.delete('/:id', authenticateToken, requireRole(['admin', 'manager']), deleteAnnouncement);

export default router;