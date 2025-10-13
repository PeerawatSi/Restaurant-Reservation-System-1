import express from 'express';
import { authenticateToken, checkRole } from '../middleware/auth.js';
import {
  createRestaurant,
  getMyRestaurants,
  updateRestaurant,
  createTable,
  getRestaurantTables,
  createTimeSlot,
  getRestaurantTimeSlots,
  getAvailableTables,
  getAllRestaurants,
  getRestaurantById,
  deleteRestaurant,
  updateTable,
  deleteTable,
  updateTimeSlot,
  deleteTimeSlot
} from '../controllers/restaurantController.js';

const router = express.Router();

// Public routes
router.get('/', getAllRestaurants);
router.get('/:restaurantId', getRestaurantById);
router.get('/:restaurantId/tables', getRestaurantTables);
router.get('/:restaurantId/time-slots', getRestaurantTimeSlots);

// Owner routes
router.post('/', authenticateToken, checkRole('owner', 'admin'), createRestaurant);
router.get('/my/restaurants', authenticateToken, checkRole('owner', 'admin'), getMyRestaurants);
router.put('/:restaurantId', authenticateToken, checkRole('owner', 'admin'), updateRestaurant);
router.post('/:restaurantId/tables', authenticateToken, checkRole('owner', 'admin'), createTable);
router.post('/:restaurantId/time-slots', authenticateToken, checkRole('owner', 'admin'), createTimeSlot);
router.delete('/:restaurantId', authenticateToken, checkRole('owner', 'admin'), deleteRestaurant);
router.put('/:restaurantId/tables/:tableId', authenticateToken, checkRole('owner', 'admin'), updateTable);
router.delete('/:restaurantId/tables/:tableId', authenticateToken, checkRole('owner', 'admin'), deleteTable);
router.put('/:restaurantId/time-slots/:slotId', authenticateToken, checkRole('owner', 'admin'), updateTimeSlot);
router.delete('/:restaurantId/time-slots/:slotId', authenticateToken, checkRole('owner', 'admin'), deleteTimeSlot);
router.get('/:restaurantId/available-tables', getAvailableTables);

export default router;