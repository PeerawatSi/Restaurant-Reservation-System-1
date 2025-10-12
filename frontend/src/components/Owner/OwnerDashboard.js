import React, { useState, useEffect } from 'react';
import { getMyRestaurants, createRestaurant } from '../../services/api';
import { useNavigate } from 'react-router-dom';

const OwnerDashboard = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState('');
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData({...formData, image_url: reader.result});
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (restaurants.length > 0) {
      alert('You can only create one restaurant per account');
      return;
    }

    try {
      await createRestaurant(formData);
      alert('Restaurant created successfully!');
      setShowForm(false);
      setImagePreview('');
      loadRestaurants();
      setFormData({ 
        name: '', 
        description: '', 
        address: '', 
        phone: '', 
        cuisine_type: '', 
        opening_time: '09:00', 
        closing_time: '22:00', 
        image_url: '' 
      });
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to create restaurant');
    }
  };

  if (loading) return <div style={styles.loading}>Loading...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>My Restaurants</h1>
        {restaurants.length === 0 && (
          <button onClick={() => setShowForm(!showForm)} style={styles.addBtn}>
            {showForm ? '✕ Cancel' : '+ Add Restaurant'}
          </button>
        )}
      </div>

      {restaurants.length > 0 && (
        <div style={styles.limitInfo}>
          <p>⚠️ You have reached the limit of 1 restaurant per account.</p>
        </div>
      )}

      {showForm && restaurants.length === 0 && (
        <form onSubmit={handleSubmit} style={styles.form}>
          <h3 style={{marginBottom: '1.5rem'}}>Create New Restaurant</h3>
          
          {/* Image Upload */}
          <div style={styles.imageUploadSection}>
            <label style={styles.imageLabel}>
              <div style={styles.imageUploadBox}>
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" style={styles.imagePreview} />
                ) : (
                  <div style={styles.uploadPlaceholder}>
                    <span style={styles.uploadIcon}>📸</span>
                    <p>Click to upload restaurant image</p>
                    <p style={styles.uploadHint}>JPG, PNG (Max 5MB)</p>
                  </div>
                )}
              </div>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageChange}
                style={{display: 'none'}}
              />
            </label>
            {imagePreview && (
              <button 
                type="button"
                onClick={() => {
                  setImagePreview('');
                  setFormData({...formData, image_url: ''});
                }}
                style={styles.removeImageBtn}
              >
                Remove Image
              </button>
            )}
          </div>

          <div style={styles.formGrid}>
            <input 
              type="text" 
              placeholder="Restaurant Name *" 
              required 
              value={formData.name} 
              onChange={(e) => setFormData({...formData, name: e.target.value})} 
              style={styles.input} 
            />
            <input 
              type="text" 
              placeholder="Cuisine Type *" 
              required
              value={formData.cuisine_type} 
              onChange={(e) => setFormData({...formData, cuisine_type: e.target.value})} 
              style={styles.input} 
            />
            <input 
              type="tel" 
              placeholder="Phone *" 
              required
              value={formData.phone} 
              onChange={(e) => setFormData({...formData, phone: e.target.value})} 
              style={styles.input} 
            />
            <div style={styles.timeInputs}>
              <div>
                <label style={styles.timeLabel}>Opening Time *</label>
                <input 
                  type="time" 
                  required
                  value={formData.opening_time} 
                  onChange={(e) => setFormData({...formData, opening_time: e.target.value})} 
                  style={styles.input} 
                />
              </div>
              <div>
                <label style={styles.timeLabel}>Closing Time *</label>
                <input 
                  type="time" 
                  required
                  value={formData.closing_time} 
                  onChange={(e) => setFormData({...formData, closing_time: e.target.value})} 
                  style={styles.input} 
                />
              </div>
            </div>
          </div>
          
          <textarea 
            placeholder="Address *" 
            required 
            value={formData.address} 
            onChange={(e) => setFormData({...formData, address: e.target.value})} 
            style={{...styles.input, minHeight: '60px', width: '100%'}} 
          />
          
          <textarea 
            placeholder="Description" 
            value={formData.description} 
            onChange={(e) => setFormData({...formData, description: e.target.value})} 
            style={{...styles.input, minHeight: '100px', width: '100%'}} 
          />
          
          <button type="submit" style={styles.submitBtn}>
            Create Restaurant
          </button>
        </form>
      )}

      <div style={styles.grid}>
        {restaurants.map((restaurant) => (
          <div key={restaurant.id} style={styles.card} onClick={() => navigate(`/owner/restaurant/${restaurant.id}`)}>
            <img 
              src={restaurant.image_url || 'https://via.placeholder.com/300x200?text=No+Image'} 
              alt={restaurant.name} 
              style={styles.image} 
            />
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
  limitInfo: { background: '#fff3cd', border: '1px solid #ffc107', padding: '1rem', borderRadius: '8px', marginBottom: '2rem', color: '#856404' },
  form: { background: 'white', padding: '2rem', borderRadius: '12px', marginBottom: '2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
  imageUploadSection: { marginBottom: '2rem' },
  imageLabel: { cursor: 'pointer', display: 'block' },
  imageUploadBox: { border: '2px dashed #ddd', borderRadius: '12px', overflow: 'hidden', marginBottom: '1rem' },
  imagePreview: { width: '100%', height: '300px', objectFit: 'cover' },
  uploadPlaceholder: { padding: '3rem', textAlign: 'center', color: '#999' },
  uploadIcon: { fontSize: '4rem', display: 'block', marginBottom: '1rem' },
  uploadHint: { fontSize: '0.9rem', color: '#bbb', marginTop: '0.5rem' },
  removeImageBtn: { padding: '0.5rem 1rem', background: '#dc3545', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem' },
  formGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1rem' },
  timeInputs: { display: 'flex', gap: '1rem', gridColumn: 'span 2' },
  timeLabel: { display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem', color: '#666', fontWeight: '600' },
  input: { width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '6px', fontSize: '1rem', marginBottom: '1rem' },
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