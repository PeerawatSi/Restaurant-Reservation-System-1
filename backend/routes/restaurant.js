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
  getAllRestaurants,
  getRestaurantById
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

export default router;