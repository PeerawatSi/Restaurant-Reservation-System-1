import pool from '../config/database.js';

export const createRestaurant = async (req, res) => {
  try {
    // Check if user already has a restaurant (limit 1 per email)
    const existingRestaurant = await pool.query(
      'SELECT id FROM restaurants WHERE owner_id = $1',
      [req.user.id]
    );

    if (existingRestaurant.rows.length > 0) {
      return res.status(400).json({ error: 'You can only create one restaurant per account' });
    }

    const { name, description, address, phone, cuisine_type, opening_time, closing_time, image_url } = req.body;
    
    const result = await pool.query(
      `INSERT INTO restaurants 
       (owner_id, name, description, address, phone, cuisine_type, opening_time, closing_time, image_url) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [req.user.id, name, description, address, phone, cuisine_type, opening_time, closing_time, image_url]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getMyRestaurants = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM restaurants WHERE owner_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateRestaurant = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const { name, description, address, phone, cuisine_type, opening_time, closing_time, image_url, is_active } = req.body;

    const result = await pool.query(
      `UPDATE restaurants 
       SET name = $1, description = $2, address = $3, phone = $4, 
           cuisine_type = $5, opening_time = $6, closing_time = $7, 
           image_url = $8, is_active = $9, updated_at = CURRENT_TIMESTAMP
       WHERE id = $10 AND owner_id = $11 RETURNING *`,
      [name, description, address, phone, cuisine_type, opening_time, closing_time, image_url, is_active, restaurantId, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Restaurant not found or unauthorized' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const deleteRestaurant = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const result = await pool.query(
      'DELETE FROM restaurants WHERE id = $1 AND owner_id = $2 RETURNING *',
      [restaurantId, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Restaurant not found or unauthorized' });
    }

    res.json({ message: 'Restaurant deleted successfully', restaurant: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateTable = async (req, res) => {
  try {
    const { restaurantId, tableId } = req.params;
    const { table_number, capacity, is_available } = req.body;

    // Verify ownership
    const ownerCheck = await pool.query(
      'SELECT id FROM restaurants WHERE id = $1 AND owner_id = $2',
      [restaurantId, req.user.id]
    );

    if (ownerCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const result = await pool.query(
      `UPDATE restaurant_tables 
       SET table_number = $1, capacity = $2, is_available = $3 
       WHERE id = $4 AND restaurant_id = $5 RETURNING *`,
      [table_number, capacity, is_available, tableId, restaurantId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Table not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const deleteTable = async (req, res) => {
  try {
    const { restaurantId, tableId } = req.params;

    // Verify ownership
    const ownerCheck = await pool.query(
      'SELECT id FROM restaurants WHERE id = $1 AND owner_id = $2',
      [restaurantId, req.user.id]
    );

    if (ownerCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const result = await pool.query(
      'DELETE FROM restaurant_tables WHERE id = $1 AND restaurant_id = $2 RETURNING *',
      [tableId, restaurantId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Table not found' });
    }

    res.json({ message: 'Table deleted successfully', table: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateTimeSlot = async (req, res) => {
  try {
    const { restaurantId, slotId } = req.params;
    const { slot_time, duration_minutes, max_tables, is_active } = req.body;

    // Verify ownership
    const ownerCheck = await pool.query(
      'SELECT id FROM restaurants WHERE id = $1 AND owner_id = $2',
      [restaurantId, req.user.id]
    );

    if (ownerCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const result = await pool.query(
      `UPDATE time_slots 
       SET slot_time = $1, duration_minutes = $2, max_tables = $3, is_active = $4 
       WHERE id = $5 AND restaurant_id = $6 RETURNING *`,
      [slot_time, duration_minutes, max_tables, is_active, slotId, restaurantId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Time slot not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const deleteTimeSlot = async (req, res) => {
  try {
    const { restaurantId, slotId } = req.params;

    // Verify ownership
    const ownerCheck = await pool.query(
      'SELECT id FROM restaurants WHERE id = $1 AND owner_id = $2',
      [restaurantId, req.user.id]
    );

    if (ownerCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const result = await pool.query(
      'DELETE FROM time_slots WHERE id = $1 AND restaurant_id = $2 RETURNING *',
      [slotId, restaurantId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Time slot not found' });
    }

    res.json({ message: 'Time slot deleted successfully', timeSlot: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const createTable = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const { table_number, capacity } = req.body;

    // Verify ownership
    const ownerCheck = await pool.query(
      'SELECT id FROM restaurants WHERE id = $1 AND owner_id = $2',
      [restaurantId, req.user.id]
    );

    if (ownerCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const result = await pool.query(
      'INSERT INTO restaurant_tables (restaurant_id, table_number, capacity) VALUES ($1, $2, $3) RETURNING *',
      [restaurantId, table_number, capacity]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getRestaurantTables = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const result = await pool.query(
      'SELECT * FROM restaurant_tables WHERE restaurant_id = $1 ORDER BY table_number',
      [restaurantId]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getAvailableTables = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const { date, timeSlotId } = req.query;

    if (!date || !timeSlotId) {
      return res.status(400).json({ error: 'Date and time slot are required' });
    }

    // Get all tables for the restaurant
    const allTables = await pool.query(
      'SELECT * FROM restaurant_tables WHERE restaurant_id = $1 AND is_available = true ORDER BY table_number',
      [restaurantId]
    );

    // Get reserved tables for this date and time slot
    const reservedTables = await pool.query(
      `SELECT table_id FROM reservations 
       WHERE restaurant_id = $1 
       AND reservation_date = $2 
       AND time_slot_id = $3 
       AND status IN ('confirmed', 'pending')`,
      [restaurantId, date, timeSlotId]
    );

    const reservedTableIds = reservedTables.rows.map(r => r.table_id);

    // Filter out reserved tables and add availability status
    const availableTables = allTables.rows.map(table => ({
      ...table,
      isBookedForSlot: reservedTableIds.includes(table.id)
    })).filter(table => !table.isBookedForSlot);

    res.json(availableTables);
  } catch (error) {
    console.error('Error getting available tables:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const createTimeSlot = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const { slot_time, duration_minutes, max_tables } = req.body;

    // Verify ownership
    const ownerCheck = await pool.query(
      'SELECT id FROM restaurants WHERE id = $1 AND owner_id = $2',
      [restaurantId, req.user.id]
    );

    if (ownerCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const result = await pool.query(
      'INSERT INTO time_slots (restaurant_id, slot_time, duration_minutes, max_tables) VALUES ($1, $2, $3, $4) RETURNING *',
      [restaurantId, slot_time, duration_minutes, max_tables]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getRestaurantTimeSlots = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const result = await pool.query(
      'SELECT * FROM time_slots WHERE restaurant_id = $1 AND is_active = true ORDER BY slot_time',
      [restaurantId]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getAllRestaurants = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM restaurants 
       WHERE is_active = true AND is_banned = false 
       ORDER BY created_at DESC`
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getRestaurantById = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const result = await pool.query(
      'SELECT * FROM restaurants WHERE id = $1',
      [restaurantId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};