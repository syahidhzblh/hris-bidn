import express from 'express';
import {
  getTodayAttendance,
  getAttendanceHistory,
  clockIn,
  clockOut,
  getAttendanceStats
} from '../controllers/attendanceController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/:employeeId/today', authenticateToken, getTodayAttendance);
router.get('/:employeeId/history', authenticateToken, getAttendanceHistory);
router.get('/:employeeId/stats', authenticateToken, getAttendanceStats);
router.post('/:employeeId/clock-in', authenticateToken, clockIn);
router.post('/:employeeId/clock-out', authenticateToken, clockOut);

export default router;