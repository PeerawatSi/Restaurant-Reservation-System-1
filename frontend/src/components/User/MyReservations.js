import React, { useState, useEffect } from 'react';
import { getUserReservations, cancelReservation } from '../../services/api';

const MyReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReservations();
  }, []);

  const loadReservations = async () => {
    try {
      const response = await getUserReservations();
      setReservations(response.data);
    } catch (error) {
      console.error('Error loading reservations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this reservation?')) return;
    
    try {
      await cancelReservation(id);
      alert('Reservation cancelled successfully');
      loadReservations();
    } catch (error) {
      alert('Failed to cancel reservation');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#ffa500',
      confirmed: '#28a745',
      cancelled: '#dc3545',
      completed: '#6c757d'
    };
    return colors[status] || '#999';
  };

  if (loading) return <div style={styles.loading}>Loading...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.background}>
        <h1 style={styles.title}>My Reservations</h1>
        <div style={styles.line}></div>
        {reservations.length === 0 ? (
          <div style={styles.empty}>
            <p>You don't have any reservations yet.</p>
            <a href="/" style={styles.browseBtn}>Browse Restaurants</a>
          </div>
        ) : (
          <div style={styles.grid}>
            {reservations.map((reservation) => (
              <div key={reservation.id} style={styles.card}>
                <div style={styles.cardHeader}>
                  <h3 style={styles.restaurantName}>{reservation.restaurant_name}</h3>
                  <span style={{...styles.status, background: getStatusColor(reservation.status)}}>
                    {reservation.status}
                  </span>
                </div>
                
                <div style={styles.cardBody}>
                  <p><strong>📅 Date:</strong> {new Date(reservation.reservation_date).toLocaleDateString()}</p>
                  <p><strong>🕒 Time:</strong> {reservation.slot_time}</p>
                  <p><strong>🪑 Table:</strong> {reservation.table_number}</p>
                  <p><strong>👥 Guests:</strong> {reservation.guest_count}</p>
                  <p><strong>📍 Address:</strong> {reservation.address}</p>
                  {reservation.special_requests && (
                    <p><strong>📝 Requests:</strong> {reservation.special_requests}</p>
                  )}
                </div>
                
                {reservation.status === 'pending' && (
                  <button onClick={() => handleCancel(reservation.id)} style={styles.cancelBtn}>
                    Cancel Reservation
                  </button>
                )}
              </div>
            ))}
          </div>
          
        )}
      </div>
    </div>
  );
};

const styles = {
  container: { minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' },
  title: { fontSize: '2rem', marginBottom: '2rem',  },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem' },
  card: { background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' },
  restaurantName: { fontSize: '1.3rem', color: '#333' },
  status: { padding: '0.25rem 0.75rem', borderRadius: '20px', color: 'white', fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase' },
  cardBody: { lineHeight: '2', color: '#666' },
  cancelBtn: { width: '100%', marginTop: '1rem', padding: '0.75rem', background: '#dc3545', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' },
  loading: { textAlign: 'center', padding: '4rem', fontSize: '1.2rem' },
  empty: { textAlign: 'center', padding: '4rem' },
  browseBtn: { display: 'inline-block', marginTop: '1rem', padding: '0.75rem 2rem', background: 'linear-gradient(135deg, #B6771D 0%, #764ba2 100%)', color: 'white', textDecoration: 'none', borderRadius: '6px', fontWeight: '600' },
  background: {
    maxWidth: '1200px', 
    margin: '0 auto', 
    padding: '2rem',
    background: '#F2F2F2'
  },
  line: {
    borderTop: '2px solid #234149c5',
    paddingTop: '2rem',
  }
};

export default MyReservations;