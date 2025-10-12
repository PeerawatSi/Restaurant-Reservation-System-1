import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRestaurantById, getRestaurantTables, getRestaurantTimeSlots, createReservation } from '../../services/api';

const RestaurantDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [tables, setTables] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [formData, setFormData] = useState({
    table_id: '',
    time_slot_id: '',
    reservation_date: '',
    guest_count: 1,
    special_requests: ''
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const [restaurantRes, tablesRes, timeSlotsRes] = await Promise.all([
        getRestaurantById(id),
        getRestaurantTables(id),
        getRestaurantTimeSlots(id)
      ]);
      setRestaurant(restaurantRes.data);
      setTables(tablesRes.data);
      setTimeSlots(timeSlotsRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createReservation({
        restaurant_id: parseInt(id),
        ...formData,
        table_id: parseInt(formData.table_id),
        time_slot_id: parseInt(formData.time_slot_id),
        guest_count: parseInt(formData.guest_count)
      });
      alert('Reservation created successfully!');
      navigate('/my-reservations');
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to create reservation');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div style={styles.loading}>Loading...</div>;
  if (!restaurant) return <div style={styles.loading}>Restaurant not found</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <img src={restaurant.image_url || 'https://via.placeholder.com/1200x400'} alt={restaurant.name} style={styles.headerImage} />
        <div style={styles.headerOverlay}>
          <h1 style={styles.title}>{restaurant.name}</h1>
          <p style={styles.cuisine}>{restaurant.cuisine_type}</p>
        </div>
      </div>

      <div style={styles.content}>
        <div style={styles.info}>
          <h2>About</h2>
          <p>{restaurant.description || 'A wonderful dining experience awaits you!'}</p>
          <div style={styles.details}>
            <p><strong>📍 Address:</strong> {restaurant.address}</p>
            <p><strong>📞 Phone:</strong> {restaurant.phone}</p>
            <p><strong>🕒 Hours:</strong> {restaurant.opening_time} - {restaurant.closing_time}</p>
          </div>
        </div>

        <div style={styles.bookingCard}>
          <h2>Make a Reservation</h2>
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Date *</label>
              <input
                type="date"
                required
                min={new Date().toISOString().split('T')[0]}
                value={formData.reservation_date}
                onChange={(e) => setFormData({...formData, reservation_date: e.target.value})}
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Time Slot *</label>
              <select
                required
                value={formData.time_slot_id}
                onChange={(e) => setFormData({...formData, time_slot_id: e.target.value})}
                style={styles.input}
              >
                <option value="">Select time</option>
                {timeSlots.map((slot) => (
                  <option key={slot.id} value={slot.id}>
                    {slot.slot_time} ({slot.duration_minutes} min)
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Table *</label>
              <select
                required
                value={formData.table_id}
                onChange={(e) => setFormData({...formData, table_id: e.target.value})}
                style={styles.input}
              >
                <option value="">Select table</option>
                {tables.filter(t => t.is_available).map((table) => (
                  <option key={table.id} value={table.id}>
                    Table {table.table_number} (Capacity: {table.capacity})
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Number of Guests *</label>
              <input
                type="number"
                required
                min="1"
                value={formData.guest_count}
                onChange={(e) => setFormData({...formData, guest_count: e.target.value})}
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Special Requests</label>
              <textarea
                value={formData.special_requests}
                onChange={(e) => setFormData({...formData, special_requests: e.target.value})}
                style={{...styles.input, minHeight: '80px'}}
                placeholder="Any special requests or dietary requirements..."
              />
            </div>

            <button type="submit" disabled={submitting} style={styles.submitBtn}>
              {submitting ? 'Booking...' : 'Book Now'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { minHeight: '100vh', background: '#f5f5f5' },
  header: { position: 'relative', height: '400px' },
  headerImage: { width: '100%', height: '100%', objectFit: 'cover' },
  headerOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.8))', padding: '2rem', color: 'white' },
  title: { fontSize: '3rem', marginBottom: '0.5rem' },
  cuisine: { fontSize: '1.5rem', opacity: 0.9 },
  content: { maxWidth: '1200px', margin: '0 auto', padding: '2rem', display: 'grid', gridTemplateColumns: '1fr 400px', gap: '2rem' },
  info: { background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
  details: { marginTop: '2rem', lineHeight: '2' },
  bookingCard: { background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', height: 'fit-content', position: 'sticky', top: '100px' },
  form: { marginTop: '1.5rem' },
  formGroup: { marginBottom: '1.5rem' },
  label: { display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' },
  input: { width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '6px', fontSize: '1rem' },
  submitBtn: { width: '100%', padding: '1rem', background: '#667eea', color: 'white', border: 'none', borderRadius: '6px', fontSize: '1.1rem', fontWeight: '600', cursor: 'pointer' },
  loading: { textAlign: 'center', padding: '4rem', fontSize: '1.2rem' },
};

export default RestaurantDetail;