import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const loginWithGoogle = () => {
  window.location.href = `${API_URL}/auth/google`;
};

export const getCurrentUser = () => api.get('/auth/me');
export const logout = () => api.post('/auth/logout');

// Admin
export const getAllUsers = () => api.get('/admin/users');
export const banUser = (userId, isBanned) => api.patch(`/admin/users/${userId}/ban`, { is_banned: isBanned });
export const getAllRestaurantsAdmin = () => api.get('/admin/restaurants');
export const banRestaurant = (restaurantId, isBanned) => api.patch(`/admin/restaurants/${restaurantId}/ban`, { is_banned: isBanned });

// Restaurants
export const getAllRestaurants = () => api.get('/restaurants');
export const getRestaurantById = (id) => api.get(`/restaurants/${id}`);
export const createRestaurant = (data) => api.post('/restaurants', data);
export const getMyRestaurants = () => api.get('/restaurants/my/restaurants');
export const updateRestaurant = (id, data) => api.put(`/restaurants/${id}`, data);

// Tables
export const getRestaurantTables = (restaurantId) => api.get(`/restaurants/${restaurantId}/tables`);
export const createTable = (restaurantId, data) => api.post(`/restaurants/${restaurantId}/tables`, data);

// Time Slots
export const getRestaurantTimeSlots = (restaurantId) => api.get(`/restaurants/${restaurantId}/time-slots`);
export const createTimeSlot = (restaurantId, data) => api.post(`/restaurants/${restaurantId}/time-slots`, data);

// Reservations
export const createReservation = (data) => api.post('/reservations', data);
export const getUserReservations = () => api.get('/reservations/my');
export const getRestaurantReservations = (restaurantId) => api.get(`/reservations/restaurant/${restaurantId}`);
export const updateReservationStatus = (id, status) => api.patch(`/reservations/${id}/status`, { status });
export const cancelReservation = (id) => api.delete(`/reservations/${id}`);

export default api;