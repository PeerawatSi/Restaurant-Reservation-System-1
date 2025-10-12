import pool from '../config/database.js';

export const getAllUsers = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, email, name, role, is_banned, created_at 
       FROM users ORDER BY created_at DESC`
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const banUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { is_banned } = req.body;

    const result = await pool.query(
      'UPDATE users SET is_banned = $1 WHERE id = $2 RETURNING *',
      [is_banned, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ 
      message: `User ${is_banned ? 'banned' : 'unbanned'} successfully`,
      user: result.rows[0]
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const banRestaurant = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const { is_banned } = req.body;

    const result = await pool.query(
      'UPDATE restaurants SET is_banned = $1 WHERE id = $2 RETURNING *',
      [is_banned, restaurantId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    res.json({ 
      message: `Restaurant ${is_banned ? 'banned' : 'unbanned'} successfully`,
      restaurant: result.rows[0]
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getAllRestaurants = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT r.*, u.name as owner_name, u.email as owner_email
       FROM restaurants r
       JOIN users u ON r.owner_id = u.id
       ORDER BY r.created_at DESC`
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};