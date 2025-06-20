import pool from '../database/connection.js';

export const getAnnouncements = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        a.*,
        u.full_name as author_name,
        u.avatar_url as author_avatar
      FROM announcements a
      LEFT JOIN users u ON a.published_by = u.id
      WHERE a.is_published = true
      ORDER BY a.published_at DESC
    `);

    res.json({ announcements: result.rows });
  } catch (error) {
    console.error('Get announcements error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createAnnouncement = async (req, res) => {
  try {
    const {
      title,
      content,
      announcement_type,
      target_roles,
      target_divisions,
      is_published,
      expires_at
    } = req.body;

    const published_at = is_published ? new Date().toISOString() : null;

    const result = await pool.query(`
      INSERT INTO announcements (
        title, content, announcement_type, published_by, target_roles,
        target_divisions, is_published, published_at, expires_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `, [
      title, content, announcement_type, req.user.id, target_roles,
      target_divisions, is_published, published_at, expires_at
    ]);

    res.status(201).json({
      message: 'Announcement created successfully',
      announcement: result.rows[0]
    });
  } catch (error) {
    console.error('Create announcement error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      content,
      announcement_type,
      target_roles,
      target_divisions,
      is_published,
      expires_at
    } = req.body;

    const result = await pool.query(`
      UPDATE announcements 
      SET 
        title = COALESCE($1, title),
        content = COALESCE($2, content),
        announcement_type = COALESCE($3, announcement_type),
        target_roles = COALESCE($4, target_roles),
        target_divisions = COALESCE($5, target_divisions),
        is_published = COALESCE($6, is_published),
        expires_at = COALESCE($7, expires_at),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $8
      RETURNING *
    `, [
      title, content, announcement_type, target_roles,
      target_divisions, is_published, expires_at, id
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Announcement not found' });
    }

    res.json({
      message: 'Announcement updated successfully',
      announcement: result.rows[0]
    });
  } catch (error) {
    console.error('Update announcement error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM announcements WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Announcement not found' });
    }

    res.json({ message: 'Announcement deleted successfully' });
  } catch (error) {
    console.error('Delete announcement error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};