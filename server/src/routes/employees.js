import express from 'express';
import {
  getEmployees,
  getEmployeeByUserId,
  createEmployee,
  updateEmployee,
  getDivisions
} from '../controllers/employeeController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateToken, getEmployees);
router.get('/user/:userId', authenticateToken, getEmployeeByUserId);
router.get('/divisions', authenticateToken, getDivisions);
router.post('/', authenticateToken, requireRole(['admin']), createEmployee);
router.put('/:id', authenticateToken, requireRole(['admin']), updateEmployee);

export default router;