import express from 'express';
import { authenticateToken, checkRole } from '../middleware/auth.js';
import {
  createRestaurant,
  getMyRestaurants,
  updateRestaurant,
  deleteRestaurant,
  createTable,
  getRestaurantTables,
  getAvailableTables,
  updateTable,
  deleteTable,
  createTimeSlot,
  getRestaurantTimeSlots,
  getTimeSlotsWithAvailability,  
  updateTimeSlot,
  deleteTimeSlot,
  getAllRestaurants,
  getRestaurantById
} from '../controllers/restaurantController.js';

const router = express.Router();

// Public routes
router.get('/', getAllRestaurants);
router.get('/:restaurantId', getRestaurantById);
router.get('/:restaurantId/tables', getRestaurantTables);
router.get('/:restaurantId/available-tables', getAvailableTables);
router.get('/:restaurantId/time-slots', getRestaurantTimeSlots);
router.get('/:restaurantId/time-slots-availability', getTimeSlotsWithAvailability);  // ← ADD THIS ROUTE

// Owner routes
router.post('/', authenticateToken, checkRole('owner', 'admin'), createRestaurant);
router.get('/my/restaurants', authenticateToken, checkRole('owner', 'admin'), getMyRestaurants);
router.put('/:restaurantId', authenticateToken, checkRole('owner', 'admin'), updateRestaurant);
router.delete('/:restaurantId', authenticateToken, checkRole('owner', 'admin'), deleteRestaurant);

// Table routes
router.post('/:restaurantId/tables', authenticateToken, checkRole('owner', 'admin'), createTable);
router.put('/:restaurantId/tables/:tableId', authenticateToken, checkRole('owner', 'admin'), updateTable);
router.delete('/:restaurantId/tables/:tableId', authenticateToken, checkRole('owner', 'admin'), deleteTable);

// Time slot routes
router.post('/:restaurantId/time-slots', authenticateToken, checkRole('owner', 'admin'), createTimeSlot);
router.put('/:restaurantId/time-slots/:slotId', authenticateToken, checkRole('owner', 'admin'), updateTimeSlot);
router.delete('/:restaurantId/time-slots/:slotId', authenticateToken, checkRole('owner', 'admin'), deleteTimeSlot);

export default router;