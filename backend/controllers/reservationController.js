import pool from '../config/database.js';

export const createReservation = async (req, res) => {
  try {
    const { restaurant_id, table_id, time_slot_id, reservation_date, guest_count, special_requests } = req.body;

    // Check if table is available for that time slot
    const availabilityCheck = await pool.query(
      `SELECT * FROM reservations 
       WHERE table_id = $1 AND time_slot_id = $2 AND reservation_date = $3 
       AND status IN ('pending', 'confirmed')`,
      [table_id, time_slot_id, reservation_date]
    );

    if (availabilityCheck.rows.length > 0) {
      return res.status(400).json({ error: 'Table not available for selected time slot' });
    }

    const result = await pool.query(
      `INSERT INTO reservations 
       (user_id, restaurant_id, table_id, time_slot_id, reservation_date, guest_count, special_requests, status) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending') RETURNING *`,
      [req.user.id, restaurant_id, table_id, time_slot_id, reservation_date, guest_count, special_requests]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getUserReservations = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT res.*, r.name as restaurant_name, r.address, 
              ts.slot_time, rt.table_number
       FROM reservations res
       JOIN restaurants r ON res.restaurant_id = r.id
       JOIN time_slots ts ON res.time_slot_id = ts.id
       JOIN restaurant_tables rt ON res.table_id = rt.id
       WHERE res.user_id = $1
       ORDER BY res.reservation_date DESC, ts.slot_time DESC`,
      [req.user.id]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getRestaurantReservations = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    // Verify ownership
    const ownerCheck = await pool.query(
      'SELECT id FROM restaurants WHERE id = $1 AND owner_id = $2',
      [restaurantId, req.user.id]
    );

    if (ownerCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const result = await pool.query(
      `SELECT res.*, u.name as user_name, u.email as user_email,
              ts.slot_time, rt.table_number
       FROM reservations res
       JOIN users u ON res.user_id = u.id
       JOIN time_slots ts ON res.time_slot_id = ts.id
       JOIN restaurant_tables rt ON res.table_id = rt.id
       WHERE res.restaurant_id = $1
       ORDER BY res.reservation_date DESC, ts.slot_time DESC`,
      [restaurantId]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateReservationStatus = async (req, res) => {
  try {
    const { reservationId } = req.params;
    const { status } = req.body;

    const result = await pool.query(
      `UPDATE reservations 
       SET status = $1, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $2 RETURNING *`,
      [status, reservationId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Reservation not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const cancelReservation = async (req, res) => {
  try {
    const { reservationId } = req.params;

    const result = await pool.query(
      `UPDATE reservations 
       SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP 
       WHERE id = $1 AND user_id = $2 RETURNING *`,
      [reservationId, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Reservation not found or unauthorized' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};