import { body, validationResult } from 'express-validator';

export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array()
    });
  }
  next();
};

export const validateLogin = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  validateRequest
];

export const validateRegister = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('full_name').trim().isLength({ min: 2 }),
  validateRequest
];

export const validateLeaveRequest = [
  body('leave_type').isIn(['annual', 'sick', 'emergency', 'maternity', 'paternity', 'other']),
  body('start_date').isISO8601(),
  body('end_date').isISO8601(),
  body('reason').trim().isLength({ min: 5 }),
  validateRequest
];

export const validateAnnouncement = [
  body('title').trim().isLength({ min: 5 }),
  body('content').trim().isLength({ min: 10 }),
  body('announcement_type').isIn(['general', 'urgent', 'event']),
  validateRequest
];