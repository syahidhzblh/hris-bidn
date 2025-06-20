import pool from '../database/connection.js';

export const getLeaveRequests = async (req, res) => {
  try {
    const { employeeId } = req.query;
    
    let query = `
      SELECT 
        lr.*,
        e.employee_id as employee_number,
        u.full_name as employee_name,
        u.avatar_url as employee_avatar,
        approver_u.full_name as approver_name
      FROM leave_requests lr
      LEFT JOIN employees e ON lr.employee_id = e.id
      LEFT JOIN users u ON e.user_id = u.id
      LEFT JOIN employees approver_e ON lr.approver_id = approver_e.id
      LEFT JOIN users approver_u ON approver_e.user_id = approver_u.id
    `;
    
    const params = [];
    
    if (employeeId) {
      query += ' WHERE lr.employee_id = $1';
      params.push(employeeId);
    }
    
    query += ' ORDER BY lr.created_at DESC';

    const result = await pool.query(query, params);
    res.json({ leave_requests: result.rows });
  } catch (error) {
    console.error('Get leave requests error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createLeaveRequest = async (req, res) => {
  try {
    const {
      employee_id,
      leave_type,
      start_date,
      end_date,
      days_requested,
      reason
    } = req.body;

    const result = await pool.query(`
      INSERT INTO leave_requests (
        employee_id, leave_type, start_date, end_date, days_requested, reason
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [employee_id, leave_type, start_date, end_date, days_requested, reason]);

    res.status(201).json({
      message: 'Leave request created successfully',
      leave_request: result.rows[0]
    });
  } catch (error) {
    console.error('Create leave request error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateLeaveRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, approver_id, rejection_reason } = req.body;

    const result = await pool.query(`
      UPDATE leave_requests 
      SET 
        status = $1,
        approver_id = $2,
        approved_at = CASE WHEN $1 IN ('approved', 'rejected') THEN CURRENT_TIMESTAMP ELSE approved_at END,
        rejection_reason = $3,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $4
      RETURNING *
    `, [status, approver_id, rejection_reason, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Leave request not found' });
    }

    res.json({
      message: 'Leave request updated successfully',
      leave_request: result.rows[0]
    });
  } catch (error) {
    console.error('Update leave request error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getLeaveBalance = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { year } = req.query;
    const targetYear = year || new Date().getFullYear();

    const result = await pool.query(`
      SELECT 
        leave_type,
        SUM(days_requested) as used_days
      FROM leave_requests 
      WHERE employee_id = $1 
        AND status = 'approved'
        AND EXTRACT(YEAR FROM start_date) = $2
      GROUP BY leave_type
    `, [employeeId, targetYear]);

    // Standard leave entitlements (can be made configurable)
    const entitlements = {
      annual: 12,
      sick: 12,
      emergency: 3,
      maternity: 90,
      paternity: 7,
      other: 0
    };

    const used = {
      annual: 0,
      sick: 0,
      emergency: 0,
      maternity: 0,
      paternity: 0,
      other: 0
    };

    result.rows.forEach(row => {
      used[row.leave_type] = parseInt(row.used_days);
    });

    const balance = {};
    Object.keys(entitlements).forEach(type => {
      balance[type] = entitlements[type] - used[type];
    });

    res.json({
      balance: {
        used,
        entitlements,
        balance
      }
    });
  } catch (error) {
    console.error('Get leave balance error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};