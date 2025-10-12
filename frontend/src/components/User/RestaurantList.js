import React, { useState, useEffect } from 'react';
import { getAllRestaurants } from '../../services/api';
import { useNavigate } from 'react-router-dom';

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadRestaurants();
  }, []);

  const loadRestaurants = async () => {
    try {
      const response = await getAllRestaurants();
      setRestaurants(response.data);
    } catch (error) {
      console.error('Error loading restaurants:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={styles.loading}>Loading restaurants...</div>;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Available Restaurants</h1>
      <div style={styles.grid}>
        {restaurants.map((restaurant) => (
          <div key={restaurant.id} style={styles.card} onClick={() => navigate(`/restaurant/${restaurant.id}`)}>
            <img src={restaurant.image_url || 'https://via.placeholder.com/300x200'} alt={restaurant.name} style={styles.image} />
            <div style={styles.cardContent}>
              <h3 style={styles.restaurantName}>{restaurant.name}</h3>
              <p style={styles.cuisine}>{restaurant.cuisine_type}</p>
              <p style={styles.address}>{restaurant.address}</p>
              <p style={styles.hours}>
                {restaurant.opening_time} - {restaurant.closing_time}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: { padding: '2rem', maxWidth: '1200px', margin: '0 auto' },
  title: { fontSize: '2rem', marginBottom: '2rem', textAlign: 'center' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' },
  card: { background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', cursor: 'pointer', transition: 'transform 0.3s' },
  image: { width: '100%', height: '200px', objectFit: 'cover' },
  cardContent: { padding: '1.5rem' },
  restaurantName: { fontSize: '1.5rem', marginBottom: '0.5rem' },
  cuisine: { color: '#667eea', fontWeight: '600', marginBottom: '0.5rem' },
  address: { color: '#666', marginBottom: '0.5rem' },
  hours: { color: '#999', fontSize: '0.9rem' },
  loading: { textAlign: 'center', padding: '4rem', fontSize: '1.2rem' },
};

export default RestaurantList;