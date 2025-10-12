import React, { useState, useEffect } from 'react';
import { getMyRestaurants, createRestaurant, updateRestaurant, deleteRestaurant } from '../../services/api';
import { useNavigate } from 'react-router-dom';

const OwnerDashboard = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
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
    image_url: '',
    is_active: true
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
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

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

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      address: '',
      phone: '',
      cuisine_type: '',
      opening_time: '09:00',
      closing_time: '22:00',
      image_url: '',
      is_active: true
    });
    setImagePreview('');
    setShowForm(false);
    setEditMode(false);
    setEditingId(null);
  };

  const handleEdit = (restaurant) => {
    setFormData({
      name: restaurant.name,
      description: restaurant.description || '',
      address: restaurant.address,
      phone: restaurant.phone || '',
      cuisine_type: restaurant.cuisine_type || '',
      opening_time: restaurant.opening_time,
      closing_time: restaurant.closing_time,
      image_url: restaurant.image_url || '',
      is_active: restaurant.is_active
    });
    setImagePreview(restaurant.image_url || '');
    setEditMode(true);
    setEditingId(restaurant.id);
    setShowForm(true);
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"? This will delete all tables, time slots, and reservations associated with this restaurant.`)) {
      return;
    }

    try {
      await deleteRestaurant(id);
      alert('Restaurant deleted successfully!');
      loadRestaurants();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to delete restaurant');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!editMode && restaurants.length > 0) {
      alert('You can only create one restaurant per account');
      return;
    }

    try {
      if (editMode) {
        await updateRestaurant(editingId, formData);
        alert('Restaurant updated successfully!');
      } else {
        await createRestaurant(formData);
        alert('Restaurant created successfully!');
      }
      resetForm();
      loadRestaurants();
    } catch (error) {
      alert(error.response?.data?.error || `Failed to ${editMode ? 'update' : 'create'} restaurant`);
    }
  };

  if (loading) return <div style={styles.loading}>Loading...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>My Restaurants</h1>
        {restaurants.length === 0 && !showForm && (
          <button onClick={() => setShowForm(true)} style={styles.addBtn}>
            + Add Restaurant
          </button>
        )}
      </div>

      {restaurants.length > 0 && !editMode && (
        <div style={styles.limitInfo}>
          <p>⚠️ You have reached the limit of 1 restaurant per account.</p>
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formHeader}>
            <h3>{editMode ? 'Edit Restaurant' : 'Create New Restaurant'}</h3>
            <button type="button" onClick={resetForm} style={styles.cancelBtn}>✕</button>
          </div>
          
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

          {editMode && (
            <label style={styles.checkboxLabel}>
              <input 
                type="checkbox" 
                checked={formData.is_active}
                onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                style={styles.checkbox}
              />
              <span>Restaurant is active</span>
            </label>
          )}
          
          <button type="submit" style={styles.submitBtn}>
            {editMode ? 'Update Restaurant' : 'Create Restaurant'}
          </button>
        </form>
      )}

      <div style={styles.grid}>
        {restaurants.map((restaurant) => (
          <div key={restaurant.id} style={styles.card}>
            <div onClick={() => navigate(`/owner/restaurant/${restaurant.id}`)} style={{cursor: 'pointer'}}>
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
            <div style={styles.cardActions}>
              <button onClick={(e) => { e.stopPropagation(); handleEdit(restaurant); }} style={styles.editBtn}>
                ✏️ Edit
              </button>
              <button onClick={(e) => { e.stopPropagation(); handleDelete(restaurant.id, restaurant.name); }} style={styles.deleteBtn}>
                🗑️ Delete
              </button>
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
  formHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
  cancelBtn: { padding: '0.5rem 1rem', background: '#dc3545', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '1.2rem', fontWeight: 'bold' },
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
  checkboxLabel: { display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', fontSize: '1rem' },
  checkbox: { width: '20px', height: '20px', cursor: 'pointer' },
  submitBtn: { width: '100%', padding: '1rem', background: '#28a745', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', marginTop: '1rem' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' },
  card: { background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', transition: 'transform 0.3s' },
  image: { width: '100%', height: '200px', objectFit: 'cover' },
  cardContent: { padding: '1.5rem' },
  cuisine: { color: '#667eea', fontWeight: '600' },
  status: { marginTop: '0.5rem', fontSize: '0.9rem' },
  banned: { color: '#dc3545', fontWeight: '600', marginTop: '0.5rem' },
  cardActions: { display: 'flex', gap: '0.5rem', padding: '1rem', borderTop: '1px solid #eee' },
  editBtn: { flex: 1, padding: '0.75rem', background: '#667eea', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' },
  deleteBtn: { flex: 1, padding: '0.75rem', background: '#dc3545', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' },
  loading: { textAlign: 'center', padding: '4rem', fontSize: '1.2rem' },
  empty: { textAlign: 'center', padding: '4rem' },
};

export default OwnerDashboard;