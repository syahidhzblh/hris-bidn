import pool from '../database/connection.js';

export const getEmployees = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        e.*,
        u.email, u.full_name, u.phone, u.avatar_url,
        d.name as division_name
      FROM employees e
      LEFT JOIN users u ON e.user_id = u.id
      LEFT JOIN divisions d ON e.division_id = d.id
      ORDER BY e.created_at DESC
    `);

    res.json({ employees: result.rows });
  } catch (error) {
    console.error('Get employees error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getEmployeeByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const result = await pool.query(`
      SELECT 
        e.*,
        u.email, u.full_name, u.phone, u.avatar_url,
        d.name as division_name
      FROM employees e
      LEFT JOIN users u ON e.user_id = u.id
      LEFT JOIN divisions d ON e.division_id = d.id
      WHERE e.user_id = $1
    `, [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.json({ employee: result.rows[0] });
  } catch (error) {
    console.error('Get employee error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createEmployee = async (req, res) => {
  try {
    const {
      user_id,
      employee_id,
      position,
      division_id,
      join_date,
      salary_base,
      address,
      emergency_contact,
      emergency_phone
    } = req.body;

    const result = await pool.query(`
      INSERT INTO employees (
        user_id, employee_id, position, division_id, join_date,
        salary_base, address, emergency_contact, emergency_phone
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `, [
      user_id, employee_id, position, division_id, join_date,
      salary_base, address, emergency_contact, emergency_phone
    ]);

    res.status(201).json({
      message: 'Employee created successfully',
      employee: result.rows[0]
    });
  } catch (error) {
    console.error('Create employee error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      position,
      division_id,
      employment_status,
      salary_base,
      address,
      emergency_contact,
      emergency_phone
    } = req.body;

    const result = await pool.query(`
      UPDATE employees 
      SET 
        position = COALESCE($1, position),
        division_id = COALESCE($2, division_id),
        employment_status = COALESCE($3, employment_status),
        salary_base = COALESCE($4, salary_base),
        address = COALESCE($5, address),
        emergency_contact = COALESCE($6, emergency_contact),
        emergency_phone = COALESCE($7, emergency_phone),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $8
      RETURNING *
    `, [
      position, division_id, employment_status, salary_base,
      address, emergency_contact, emergency_phone, id
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.json({
      message: 'Employee updated successfully',
      employee: result.rows[0]
    });
  } catch (error) {
    console.error('Update employee error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getDivisions = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT d.*, u.full_name as manager_name
      FROM divisions d
      LEFT JOIN users u ON d.manager_id = u.id
      ORDER BY d.name
    `);

    res.json({ divisions: result.rows });
  } catch (error) {
    console.error('Get divisions error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};