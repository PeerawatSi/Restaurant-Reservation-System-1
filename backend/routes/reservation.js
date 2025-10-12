import express from 'express';
import { authenticateToken, checkRole } from '../middleware/auth.js';
import {
  createReservation,
  getUserReservations,
  getRestaurantReservations,
  updateReservationStatus,
  cancelReservation
} from '../controllers/reservationController.js';

const router = express.Router();

router.use(authenticateToken);

router.post('/', createReservation);
router.get('/my', getUserReservations);
router.delete('/:reservationId', cancelReservation);

// Owner routes
router.get('/restaurant/:restaurantId', checkRole('owner', 'admin'), getRestaurantReservations);
router.patch('/:reservationId/status', checkRole('owner', 'admin'), updateReservationStatus);

export default router;