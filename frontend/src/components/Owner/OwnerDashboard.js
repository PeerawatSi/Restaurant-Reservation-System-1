import React, { useState, useEffect } from 'react';
import { getMyRestaurants, createRestaurant } from '../../services/api';
import { useNavigate } from 'react-router-dom';

const OwnerDashboard = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    phone: '',
    cuisine_type: '',
    opening_time: '09:00',
    closing_time: '22:00',
    image_url: ''
  });

  useEffect(() => {
    loadRestaurants();
  }, []);

  const loadRestaurants = async () => {
    try {
      const response = await getMyRestaurants();
      setRestaurants(response.data);
    } catch (error) {
      console.error('Error loading restaurants:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createRestaurant(formData);
      alert('Restaurant created successfully!');
      setShowForm(false);
      loadRestaurants();
      setFormData({ name: '', description: '', address: '', phone: '', cuisine_type: '', opening_time: '09:00', closing_time: '22:00', image_url: '' });
    } catch (error) {
      alert('Failed to create restaurant');
    }
  };

  if (loading) return <div style={styles.loading}>Loading...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>My Restaurants</h1>
        <button onClick={() => setShowForm(!showForm)} style={styles.addBtn}>
          {showForm ? '✕ Cancel' : '+ Add Restaurant'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGrid}>
            <input type="text" placeholder="Restaurant Name *" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} style={styles.input} />
            <input type="text" placeholder="Cuisine Type" value={formData.cuisine_type} onChange={(e) => setFormData({...formData, cuisine_type: e.target.value})} style={styles.input} />
            <input type="text" placeholder="Phone" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} style={styles.input} />
            <input type="text" placeholder="Image URL" value={formData.image_url} onChange={(e) => setFormData({...formData, image_url: e.target.value})} style={styles.input} />
            <input type="time" value={formData.opening_time} onChange={(e) => setFormData({...formData, opening_time: e.target.value})} style={styles.input} />
            <input type="time" value={formData.closing_time} onChange={(e) => setFormData({...formData, closing_time: e.target.value})} style={styles.input} />
          </div>
          <textarea placeholder="Address *" required value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} style={{...styles.input, minHeight: '60px'}} />
          <textarea placeholder="Description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} style={{...styles.input, minHeight: '100px'}} />
          <button type="submit" style={styles.submitBtn}>Create Restaurant</button>
        </form>
      )}

      <div style={styles.grid}>
        {restaurants.map((restaurant) => (
          <div key={restaurant.id} style={styles.card} onClick={() => navigate(`/owner/restaurant/${restaurant.id}`)}>
            <img src={restaurant.image_url || 'https://via.placeholder.com/300x200'} alt={restaurant.name} style={styles.image} />
            <div style={styles.cardContent}>
              <h3>{restaurant.name}</h3>
              <p style={styles.cuisine}>{restaurant.cuisine_type}</p>
              <p style={styles.status}>Status: {restaurant.is_active ? '🟢 Active' : '🔴 Inactive'}</p>
              {restaurant.is_banned && <p style={styles.banned}>⚠️ Banned by Admin</p>}
            </div>
          </div>
        ))}
      </div>

      {restaurants.length === 0 && !showForm && (
        <div style={styles.empty}>
          <p>You haven't created any restaurants yet.</p>
          <button onClick={() => setShowForm(true)} style={styles.addBtn}>Create Your First Restaurant</button>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { maxWidth: '1200px', margin: '0 auto', padding: '2rem' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' },
  addBtn: { padding: '0.75rem 1.5rem', background: '#667eea', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' },
  form: { background: 'white', padding: '2rem', borderRadius: '12px', marginBottom: '2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
  formGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1rem' },
  input: { width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '6px', fontSize: '1rem' },
  submitBtn: { width: '100%', padding: '1rem', background: '#28a745', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', marginTop: '1rem' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' },
  card: { background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', cursor: 'pointer', transition: 'transform 0.3s' },
  image: { width: '100%', height: '200px', objectFit: 'cover' },
  cardContent: { padding: '1.5rem' },
  cuisine: { color: '#667eea', fontWeight: '600' },
  status: { marginTop: '0.5rem', fontSize: '0.9rem' },
  banned: { color: '#dc3545', fontWeight: '600', marginTop: '0.5rem' },
  loading: { textAlign: 'center', padding: '4rem', fontSize: '1.2rem' },
  empty: { textAlign: 'center', padding: '4rem' },
};

export default OwnerDashboard;