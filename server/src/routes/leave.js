import express from 'express';
import {
  getLeaveRequests,
  createLeaveRequest,
  updateLeaveRequest,
  getLeaveBalance
} from '../controllers/leaveController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { validateLeaveRequest } from '../middleware/validation.js';

const router = express.Router();

router.get('/', authenticateToken, getLeaveRequests);
router.get('/:employeeId/balance', authenticateToken, getLeaveBalance);
router.post('/', authenticateToken, validateLeaveRequest, createLeaveRequest);
router.put('/:id', authenticateToken, requireRole(['admin', 'manager']), updateLeaveRequest);

export default router;