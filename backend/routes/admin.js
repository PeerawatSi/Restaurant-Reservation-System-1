import express from 'express';
import { authenticateToken, checkRole } from '../middleware/auth.js';
import { getAllUsers, banUser, banRestaurant, getAllRestaurants } from '../controllers/adminController.js';

const router = express.Router();

router.use(authenticateToken, checkRole('admin'));

router.get('/users', getAllUsers);
router.patch('/users/:userId/ban', banUser);
router.get('/restaurants', getAllRestaurants);
router.patch('/restaurants/:restaurantId/ban', banRestaurant);

export default router;