import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRestaurantById, getAvailableTables, getRestaurantTimeSlots, createReservation } from '../../services/api';

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
    guest_count: 2,
    special_requests: ''
  });
  const [loading, setLoading] = useState(true);
  const [loadingTables, setLoadingTables] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, [id]);

  // Load available tables when date AND time slot are selected
  useEffect(() => {
    if (formData.reservation_date && formData.time_slot_id) {
      loadAvailableTables();
    } else {
      setTables([]);
      setFormData(prev => ({ ...prev, table_id: '' }));
    }
  }, [formData.reservation_date, formData.time_slot_id]);

  const loadData = async () => {
    try {
      const [restaurantRes, timeSlotsRes] = await Promise.all([
        getRestaurantById(id),
        getRestaurantTimeSlots(id)
      ]);
      setRestaurant(restaurantRes.data);
      setTimeSlots(timeSlotsRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAvailableTables = async () => {
    setLoadingTables(true);
    try {
      const response = await getAvailableTables(id, formData.reservation_date, formData.time_slot_id);
      setTables(response.data);
      // Reset table selection if previously selected table is no longer available
      if (formData.table_id && !response.data.find(t => t.id === formData.table_id)) {
        setFormData(prev => ({ ...prev, table_id: '' }));
      }
    } catch (error) {
      console.error('Error loading available tables:', error);
      setTables([]);
    } finally {
      setLoadingTables(false);
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
      alert('🎉 Reservation created successfully!');
      navigate('/my-reservations');
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to create reservation');
    } finally {
      setSubmitting(false);
    }
  };

  const getTableIcon = (capacity) => {
    if (capacity <= 2) return '🪑';
    if (capacity <= 4) return '🍽️';
    if (capacity <= 6) return '🍽️✨';
    return '👨‍👩‍👧‍👦';
  };

  const guestOptions = [1, 2, 3, 4, 5, 6, 7, 8, 10, 12];

  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  if (loading) return (
    <div style={styles.loadingContainer}>
      <div style={styles.spinner}></div>
      <p>Loading restaurant...</p>
    </div>
  );
  
  if (!restaurant) return <div style={styles.loading}>Restaurant not found</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <img src={restaurant.image_url || 'https://via.placeholder.com/1200x400'} alt={restaurant.name} style={styles.headerImage} />
        <div style={styles.headerOverlay}>
          <div style={styles.headerContent}>
            <h1 style={styles.title}>{restaurant.name}</h1>
            <p style={styles.cuisine}>✨ {restaurant.cuisine_type}</p>
            <div style={styles.headerInfo}>
              <span style={styles.headerBadge}>⭐ 4.8</span>
              <span style={styles.headerBadge}>📍 {restaurant.address.split(',')[0]}</span>
              <span style={styles.headerBadge}>🕒 {restaurant.opening_time} - {restaurant.closing_time}</span>
            </div>
          </div>
        </div>
      </div>

      <div style={styles.content}>
        <div style={styles.info}>
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>About This Restaurant</h2>
            <p style={styles.description}>{restaurant.description || 'A wonderful dining experience awaits you!'}</p>
          </div>

          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Contact Information</h2>
            <div style={styles.contactGrid}>
              <div style={styles.contactItem}>
                <span style={styles.contactIcon}>📍</span>
                <div>
                  <div style={styles.contactLabel}>Address</div>
                  <div style={styles.contactValue}>{restaurant.address}</div>
                </div>
              </div>
              <div style={styles.contactItem}>
                <span style={styles.contactIcon}>📞</span>
                <div>
                  <div style={styles.contactLabel}>Phone</div>
                  <div style={styles.contactValue}>{restaurant.phone}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={styles.bookingCard}>
          <div style={styles.bookingHeader}>
            <h2 style={styles.bookingTitle}>Reserve a Table</h2>
            <p style={styles.bookingSubtitle}>Select your preferred date, time, and party size</p>
          </div>
          
          <form onSubmit={handleSubmit} style={styles.form}>
            {/* Date Selection */}
            <div style={styles.formGroup}>
              <label style={styles.label}>
                <span style={styles.labelIcon}>📅</span> Select Date
              </label>
              <input
                type="date"
                required
                min={new Date().toISOString().split('T')[0]}
                value={formData.reservation_date}
                onChange={(e) => setFormData({...formData, reservation_date: e.target.value})}
                style={styles.dateInput}
              />
            </div>

            {/* Time Slot Selection */}
            <div style={styles.formGroup}>
              <label style={styles.label}>
                <span style={styles.labelIcon}>⏰</span> Select Time
              </label>
              <div style={styles.timeSlotGrid}>
                {timeSlots.map((slot) => (
                  <div
                    key={slot.id}
                    onClick={() => setFormData({...formData, time_slot_id: slot.id})}
                    style={{
                      ...styles.timeSlotCard,
                      ...(formData.time_slot_id === slot.id ? styles.timeSlotCardSelected : {})
                    }}
                  >
                    <div style={styles.timeSlotTime}>{formatTime(slot.slot_time)}</div>
                    <div style={styles.timeSlotDuration}>
                      <span style={styles.durationDot}>•</span> {slot.duration_minutes}min
                    </div>
                  </div>
                ))}
              </div>
              {timeSlots.length === 0 && (
                <div style={styles.emptyState}>
                  <span style={styles.emptyIcon}>⏰</span>
                  <p>No time slots available</p>
                </div>
              )}
            </div>

            {/* Guest Count */}
            <div style={styles.formGroup}>
              <label style={styles.label}>
                <span style={styles.labelIcon}>👥</span> Number of Guests
              </label>
              <div style={styles.guestGrid}>
                {guestOptions.map((count) => (
                  <div
                    key={count}
                    onClick={() => setFormData({...formData, guest_count: count})}
                    style={{
                      ...styles.guestCard,
                      ...(formData.guest_count === count ? styles.guestCardSelected : {})
                    }}
                  >
                    <div style={styles.guestNumber}>{count}</div>
                    <div style={styles.guestLabel}>
                      {count === 1 ? 'Guest' : 'Guests'}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Table Selection - only show after date and time are selected */}
            {formData.reservation_date && formData.time_slot_id && (
              <div style={styles.formGroup}>
                <label style={styles.label}>
                  <span style={styles.labelIcon}>🪑</span> Choose Your Table
                </label>
                {loadingTables ? (
                  <div style={styles.emptyState}>
                    <div style={styles.spinnerSmall}></div>
                    <p>Loading available tables...</p>
                  </div>
                ) : tables.length > 0 ? (
                  <div style={styles.tableGrid}>
                    {tables.map((table) => (
                      <div
                        key={table.id}
                        onClick={() => setFormData({...formData, table_id: table.id})}
                        style={{
                          ...styles.tableCard,
                          ...(formData.table_id === table.id ? styles.tableCardSelected : {})
                        }}
                      >
                        <div style={styles.tableIconLarge}>{getTableIcon(table.capacity)}</div>
                        <div style={styles.tableInfo}>
                          <div style={styles.tableNumber}>Table {table.table_number}</div>
                          <div style={styles.tableCapacity}>
                            Up to {table.capacity} guests
                          </div>
                        </div>
                        {formData.table_id === table.id && (
                          <div style={styles.selectedBadge}>✓</div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={styles.emptyState}>
                    <span style={styles.emptyIcon}>🪑</span>
                    <p>No tables available for this date and time</p>
                    <p style={styles.emptySubtext}>Please try a different time slot</p>
                  </div>
                )}
              </div>
            )}

            {!formData.reservation_date || !formData.time_slot_id ? (
              <div style={styles.helpText}>
                ℹ️ Please select a date and time to see available tables
              </div>
            ) : null}

            {/* Special Requests */}
            <div style={styles.formGroup}>
              <label style={styles.label}>
                <span style={styles.labelIcon}>📝</span> Special Requests (Optional)
              </label>
              <textarea
                value={formData.special_requests}
                onChange={(e) => setFormData({...formData, special_requests: e.target.value})}
                style={styles.textarea}
                placeholder="Dietary restrictions, allergies, special occasions..."
              />
            </div>

            <button 
              type="submit" 
              disabled={submitting || !formData.table_id || !formData.time_slot_id} 
              style={{
                ...styles.submitBtn,
                ...(submitting || !formData.table_id || !formData.time_slot_id ? styles.submitBtnDisabled : {})
              }}
            >
              {submitting ? (
                <>
                  <span style={styles.spinner}></span> Processing...
                </>
              ) : (
                <>🎉 Complete Reservation</>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' },
  header: { position: 'relative', height: '450px' },
  headerImage: { width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.85)' },
  headerOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.9))', padding: '3rem 2rem' },
  headerContent: { maxWidth: '1200px', margin: '0 auto', color: 'white' },
  title: { fontSize: '3.5rem', marginBottom: '0.75rem', fontWeight: '700', textShadow: '2px 2px 4px rgba(0,0,0,0.3)' },
  cuisine: { fontSize: '1.3rem', opacity: 0.95, marginBottom: '1rem', fontWeight: '500' },
  headerInfo: { display: 'flex', gap: '1.5rem', flexWrap: 'wrap' },
  headerBadge: { background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '0.95rem', fontWeight: '500' },
  
  content: { maxWidth: '1200px', margin: '-80px auto 0', padding: '0 2rem 4rem', display: 'grid', gridTemplateColumns: '1fr 480px', gap: '2rem', position: 'relative', zIndex: 10 },
  
  info: { display: 'flex', flexDirection: 'column', gap: '2rem' },
  section: { background: 'white', padding: '2.5rem', borderRadius: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' },
  sectionTitle: { fontSize: '1.8rem', marginBottom: '1.5rem', color: '#2d3748', fontWeight: '600' },
  description: { fontSize: '1.1rem', lineHeight: '1.8', color: '#4a5568' },
  
  contactGrid: { display: 'grid', gap: '1.5rem' },
  contactItem: { display: 'flex', gap: '1rem', alignItems: 'flex-start' },
  contactIcon: { fontSize: '1.8rem', minWidth: '40px' },
  contactLabel: { fontSize: '0.85rem', color: '#718096', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.25rem' },
  contactValue: { fontSize: '1.1rem', color: '#2d3748', fontWeight: '500' },
  
  bookingCard: { background: 'white', padding: '2.5rem', borderRadius: '20px', boxShadow: '0 20px 60px rgba(0,0,0,0.15)', height: 'fit-content', position: 'sticky', top: '100px', maxHeight: 'calc(100vh - 120px)', overflowY: 'auto' },
  bookingHeader: { marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '2px solid #e2e8f0' },
  bookingTitle: { fontSize: '1.8rem', marginBottom: '0.5rem', color: '#2d3748', fontWeight: '700' },
  bookingSubtitle: { color: '#718096', fontSize: '0.95rem' },
  
  form: { display: 'flex', flexDirection: 'column', gap: '2rem' },
  formGroup: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  label: { fontSize: '1.05rem', fontWeight: '600', color: '#2d3748', display: 'flex', alignItems: 'center', gap: '0.5rem' },
  labelIcon: { fontSize: '1.3rem' },
  
  dateInput: { width: '100%', padding: '1rem', border: '2px solid #e2e8f0', borderRadius: '12px', fontSize: '1rem', fontWeight: '500', transition: 'all 0.3s', outline: 'none' },
  
  guestGrid: { display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.75rem' },
  guestCard: { 
    padding: '1rem 0.5rem', 
    border: '2px solid #e2e8f0', 
    borderRadius: '12px', 
    cursor: 'pointer', 
    textAlign: 'center',
    transition: 'all 0.3s',
    background: 'white',
    userSelect: 'none'
  },
  guestCardSelected: { 
    border: '2px solid #667eea', 
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    transform: 'scale(1.1)',
    boxShadow: '0 8px 20px rgba(102, 126, 234, 0.4)'
  },
  guestNumber: { fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.25rem' },
  guestLabel: { fontSize: '0.75rem', opacity: 0.8, fontWeight: '500' },
  
  timeSlotGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' },
  timeSlotCard: { 
    padding: '1.25rem 0.75rem', 
    border: '2px solid #e2e8f0', 
    borderRadius: '12px', 
    cursor: 'pointer', 
    textAlign: 'center',
    transition: 'all 0.3s',
    background: 'white',
    userSelect: 'none'
  },
  timeSlotCardSelected: { 
    border: '2px solid #667eea', 
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 24px rgba(102, 126, 234, 0.4)'
  },
  timeSlotTime: { fontSize: '1.2rem', fontWeight: '700', marginBottom: '0.25rem' },
  timeSlotDuration: { fontSize: '0.85rem', opacity: 0.8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' },
  durationDot: { fontSize: '1.2rem' },
  
  tableGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' },
  tableCard: { 
    padding: '1.5rem', 
    border: '2px solid #e2e8f0', 
    borderRadius: '16px', 
    cursor: 'pointer', 
    textAlign: 'center',
    transition: 'all 0.3s',
    background: 'white',
    position: 'relative',
    userSelect: 'none'
  },
  tableCardSelected: { 
    border: '2px solid #667eea', 
    background: 'linear-gradient(135deg, #f0f3ff 0%, #e9ecff 100%)',
    boxShadow: '0 12px 28px rgba(102, 126, 234, 0.3)',
    transform: 'scale(1.05)'
  },
  tableIconLarge: { fontSize: '3rem', marginBottom: '0.75rem' },
  tableInfo: { display: 'flex', flexDirection: 'column', gap: '0.25rem' },
  tableNumber: { fontSize: '1.2rem', fontWeight: '700', color: '#2d3748' },
  tableCapacity: { fontSize: '0.9rem', color: '#718096', fontWeight: '500' },
  selectedBadge: { position: 'absolute', top: '0.75rem', right: '0.75rem', background: '#667eea', color: 'white', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1rem' },
  
  textarea: { width: '100%', padding: '1rem', border: '2px solid #e2e8f0', borderRadius: '12px', fontSize: '1rem', minHeight: '100px', resize: 'vertical', fontFamily: 'inherit', outline: 'none', transition: 'all 0.3s' },
  
  submitBtn: { 
    width: '100%', 
    padding: '1.25rem', 
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
    color: 'white', 
    border: 'none', 
    borderRadius: '14px', 
    fontSize: '1.15rem', 
    fontWeight: '700', 
    cursor: 'pointer', 
    transition: 'all 0.3s',
    boxShadow: '0 10px 30px rgba(102, 126, 234, 0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem'
  },
  submitBtnDisabled: { 
    background: '#cbd5e0', 
    cursor: 'not-allowed',
    boxShadow: 'none'
  },
  
  emptyState: { 
    textAlign: 'center', 
    padding: '3rem', 
    background: '#f7fafc', 
    borderRadius: '12px', 
    border: '2px dashed #e2e8f0' 
  },
  emptyIcon: { fontSize: '3rem', display: 'block', marginBottom: '1rem', opacity: 0.5 },
  emptySubtext: { fontSize: '0.9rem', color: '#a0aec0', marginTop: '0.5rem' },
  
  helpText: {
    background: '#e6f3ff',
    border: '1px solid #b3d9ff',
    padding: '1rem',
    borderRadius: '8px',
    color: '#0066cc',
    textAlign: 'center',
    fontSize: '0.95rem',
    marginBottom: '1rem'
  },
  
  loadingContainer: { 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center', 
    justifyContent: 'center', 
    minHeight: '100vh', 
    gap: '1rem' 
  },
  spinner: { 
    width: '40px', 
    height: '40px', 
    border: '4px solid #e2e8f0', 
    borderTop: '4px solid #667eea', 
    borderRadius: '50%', 
    animation: 'spin 1s linear infinite' 
  },
  spinnerSmall: { 
    width: '30px', 
    height: '30px', 
    border: '3px solid #e2e8f0', 
    borderTop: '3px solid #667eea', 
    borderRadius: '50%', 
    animation: 'spin 1s linear infinite',
    margin: '0 auto'
  },
  loading: { textAlign: 'center', padding: '4rem', fontSize: '1.2rem' },
};

export default RestaurantDetail;