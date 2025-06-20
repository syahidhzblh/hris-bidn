import pool from '../database/connection.js';

export const getTodayAttendance = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const today = new Date().toISOString().split('T')[0];

    const result = await pool.query(
      'SELECT * FROM attendance_records WHERE employee_id = $1 AND date = $2',
      [employeeId, today]
    );

    res.json({ 
      attendance: result.rows.length > 0 ? result.rows[0] : null 
    });
  } catch (error) {
    console.error('Get today attendance error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getAttendanceHistory = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { limit = 30 } = req.query;

    const result = await pool.query(
      'SELECT * FROM attendance_records WHERE employee_id = $1 ORDER BY date DESC LIMIT $2',
      [employeeId, limit]
    );

    res.json({ attendance: result.rows });
  } catch (error) {
    console.error('Get attendance history error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const clockIn = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { location, photo_url } = req.body;
    const today = new Date().toISOString().split('T')[0];
    const now = new Date().toISOString();

    // Check if already clocked in today
    const existing = await pool.query(
      'SELECT * FROM attendance_records WHERE employee_id = $1 AND date = $2',
      [employeeId, today]
    );

    if (existing.rows.length > 0 && existing.rows[0].clock_in) {
      return res.status(400).json({ error: 'Already clocked in today' });
    }

    // Determine status based on time (9 AM cutoff for late)
    const clockInTime = new Date(now);
    const cutoffTime = new Date(today + 'T09:00:00');
    const status = clockInTime > cutoffTime ? 'late' : 'present';

    let result;
    if (existing.rows.length > 0) {
      // Update existing record
      result = await pool.query(`
        UPDATE attendance_records 
        SET clock_in = $1, clock_in_location = $2, clock_in_photo = $3, status = $4
        WHERE employee_id = $5 AND date = $6
        RETURNING *
      `, [now, location, photo_url, status, employeeId, today]);
    } else {
      // Create new record
      result = await pool.query(`
        INSERT INTO attendance_records (employee_id, date, clock_in, clock_in_location, clock_in_photo, status)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
      `, [employeeId, today, now, location, photo_url, status]);
    }

    res.json({
      message: 'Clock in successful',
      attendance: result.rows[0]
    });
  } catch (error) {
    console.error('Clock in error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const clockOut = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { location, photo_url } = req.body;
    const today = new Date().toISOString().split('T')[0];
    const now = new Date().toISOString();

    // Get today's attendance record
    const existing = await pool.query(
      'SELECT * FROM attendance_records WHERE employee_id = $1 AND date = $2',
      [employeeId, today]
    );

    if (existing.rows.length === 0 || !existing.rows[0].clock_in) {
      return res.status(400).json({ error: 'No clock-in record found for today' });
    }

    if (existing.rows[0].clock_out) {
      return res.status(400).json({ error: 'Already clocked out today' });
    }

    const result = await pool.query(`
      UPDATE attendance_records 
      SET clock_out = $1, clock_out_location = $2, clock_out_photo = $3
      WHERE employee_id = $4 AND date = $5
      RETURNING *
    `, [now, location, photo_url, employeeId, today]);

    res.json({
      message: 'Clock out successful',
      attendance: result.rows[0]
    });
  } catch (error) {
    console.error('Clock out error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getAttendanceStats = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { month, year } = req.query;
    
    const currentDate = new Date();
    const targetMonth = month || (currentDate.getMonth() + 1);
    const targetYear = year || currentDate.getFullYear();

    const startDate = `${targetYear}-${targetMonth.toString().padStart(2, '0')}-01`;
    const endDate = new Date(targetYear, targetMonth, 0).toISOString().split('T')[0];

    const result = await pool.query(`
      SELECT 
        COUNT(*) as total_days,
        COUNT(CASE WHEN status = 'present' THEN 1 END) as present_days,
        COUNT(CASE WHEN status = 'late' THEN 1 END) as late_days,
        COUNT(CASE WHEN status = 'absent' THEN 1 END) as absent_days,
        AVG(
          CASE 
            WHEN clock_in IS NOT NULL AND clock_out IS NOT NULL 
            THEN EXTRACT(EPOCH FROM (clock_out - clock_in)) / 3600 
          END
        ) as average_hours
      FROM attendance_records 
      WHERE employee_id = $1 AND date >= $2 AND date <= $3
    `, [employeeId, startDate, endDate]);

    res.json({ stats: result.rows[0] });
  } catch (error) {
    console.error('Get attendance stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};