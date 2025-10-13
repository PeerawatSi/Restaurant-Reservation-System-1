import React, { useState, useEffect } from 'react';
import { getAllRestaurants } from '../../services/api';
import { useNavigate } from 'react-router-dom';

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadRestaurants();
    
    const interval = setInterval(loadRestaurants, 10000);
    return () => clearInterval(interval);
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

  const filteredRestaurants = restaurants.filter(restaurant =>
    restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    restaurant.cuisine_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    restaurant.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div style={styles.loadingContainer}>
      <div style={styles.spinner}></div>
      <p style={styles.loadingText}>Finding amazing restaurants...</p>
    </div>
  );

  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>Discover & Reserve</h1>
        <p style={styles.heroSubtitle}>Find your perfect dining experience</p>
        
        <div style={styles.searchContainer}>
          <span style={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Search by restaurant name, cuisine, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} style={styles.clearBtn}>✕</button>
          )}
        </div>

        <div style={styles.statsBar}>
          <div style={styles.stat}>
            <span style={styles.statNumber}>{filteredRestaurants.length}</span>
            <span style={styles.statLabel}>Restaurants</span>
          </div>
          <div style={styles.statDivider}></div>
          <div style={styles.stat}>
            <span style={styles.statNumber}>⭐ 4.8</span>
            <span style={styles.statLabel}>Avg Rating</span>
          </div>
          {/* <div style={styles.statDivider}></div>
          <div style={styles.stat}>
            <button onClick={loadRestaurants} style={styles.refreshIconBtn}>🔄</button>
            <span style={styles.statLabel}>Refresh</span>
          </div> */}
        </div>
      </div>

      {filteredRestaurants.length === 0 ? (
        <div style={styles.emptyState}>
          <span style={styles.emptyIcon}>🍽️</span>
          <h2 style={styles.emptyTitle}>No restaurants found</h2>
          <p style={styles.emptyText}>
            {searchTerm ? 'Try a different search term' : 'Check back soon for new restaurants!'}
          </p>
        </div>
      ) : (
        <div style={styles.grid}>
          {filteredRestaurants.map((restaurant) => (
            <div 
              key={restaurant.id} 
              style={styles.card} 
              onClick={() => navigate(`/restaurant/${restaurant.id}`)}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-8px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={styles.imageContainer}>
                <img 
                  src={restaurant.image_url || 'https://via.placeholder.com/400x250?text=Delicious+Food'} 
                  alt={restaurant.name} 
                  style={styles.image} 
                />
                <div style={styles.imageBadge}>
                  <span>⭐ 4.8</span>
                </div>
              </div>
              
              <div style={styles.cardContent}>
                <h3 style={styles.restaurantName}>{restaurant.name}</h3>
                <p style={styles.cuisine}>✨ {restaurant.cuisine_type}</p>
                
                <div style={styles.infoRow}>
                  <span style={styles.infoItem}>
                    <span style={styles.infoIcon}>📍</span>
                    {restaurant.address.split(',')[0]}
                  </span>
                </div>

                <div style={styles.infoRow}>
                  <span style={styles.infoItem}>
                    <span style={styles.infoIcon}>🕒</span>
                    {restaurant.opening_time} - {restaurant.closing_time}
                  </span>
                </div>

                <button style={styles.viewBtn}>
                  View Details & Reserve →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' },
  
  hero: { 
    backgroundImage: 'linear-gradient(rgba(123, 84, 47, 0.85), rgba(118, 75, 162, 0.85)), url("/mainpg-bg.jpg")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    padding: '4rem 2rem 3rem', 
    textAlign: 'center',
    boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
  },
  heroTitle: { 
    fontSize: '3.5rem', 
    color: 'white', 
    marginBottom: '0.5rem', 
    fontWeight: '800',
    textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
  },
  heroSubtitle: { 
    fontSize: '1.3rem', 
    color: 'rgba(255,255,255,0.95)', 
    marginBottom: '2.5rem',
    fontWeight: '400'
  },
  
  searchContainer: { 
    maxWidth: '700px', 
    margin: '0 auto 2rem', 
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
  },
  searchIcon: { 
    position: 'absolute', 
    left: '1.5rem', 
    fontSize: '1.5rem',
    pointerEvents: 'none'
  },
  searchInput: { 
    width: '100%', 
    padding: '1.25rem 4rem 1.25rem 4rem', 
    border: 'none', 
    borderRadius: '50px', 
    fontSize: '1.05rem',
    boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
    outline: 'none',
    transition: 'all 0.3s'
  },
  clearBtn: {
    position: 'absolute',
    right: '1.5rem',
    background: '#e2e8f0',
    border: 'none',
    borderRadius: '50%',
    width: '30px',
    height: '30px',
    cursor: 'pointer',
    fontSize: '1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s'
  },
  
  statsBar: { 
    maxWidth: '700px', 
    margin: '0 auto', 
    background: 'rgba(255,255,255,0.15)', 
    backdropFilter: 'blur(10px)',
    borderRadius: '20px', 
    padding: '1.5rem 2rem',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  stat: { 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center', 
    gap: '0.5rem' 
  },
  statNumber: { 
    fontSize: '1.8rem', 
    fontWeight: '700', 
    color: 'white' 
  },
  statLabel: { 
    fontSize: '0.9rem', 
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500'
  },
  statDivider: { 
    width: '1px', 
    height: '40px', 
    background: 'rgba(255,255,255,0.3)' 
  },
  refreshIconBtn: {
    background: 'rgba(255,255,255,0.2)',
    border: 'none',
    borderRadius: '50%',
    width: '50px',
    height: '50px',
    cursor: 'pointer',
    fontSize: '1.5rem',
    transition: 'all 0.3s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  
  grid: { 
    maxWidth: '1400px', 
    margin: '0 auto', 
    padding: '3rem 2rem',
    display: 'grid', 
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
    gap: '2rem' 
  },
  
  card: { 
    background: 'white', 
    borderRadius: '20px', 
    overflow: 'hidden', 
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)', 
    cursor: 'pointer', 
    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    display: 'flex',
    flexDirection: 'column'
  },
  
  imageContainer: { 
    position: 'relative', 
    overflow: 'hidden',
    height: '240px'
  },
  image: { 
    width: '100%', 
    height: '100%', 
    objectFit: 'cover',
    transition: 'transform 0.4s'
  },
  imageBadge: {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    background: 'rgba(255,255,255,0.95)',
    backdropFilter: 'blur(10px)',
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    fontSize: '0.95rem',
    fontWeight: '600',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
  },
  
  cardContent: { 
    padding: '1.75rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    flex: 1
  },
  restaurantName: { 
    fontSize: '1.6rem', 
    marginBottom: '0.25rem',
    color: '#2d3748',
    fontWeight: '700'
  },
  cuisine: { 
    color: '#667eea', 
    fontWeight: '600',
    fontSize: '1.05rem',
    marginBottom: '0.5rem'
  },
  
  infoRow: { 
    display: 'flex', 
    alignItems: 'center',
    gap: '0.5rem'
  },
  infoItem: { 
    display: 'flex', 
    alignItems: 'center',
    gap: '0.5rem',
    color: '#4a5568',
    fontSize: '0.95rem',
    fontWeight: '500'
  },
  infoIcon: { 
    fontSize: '1.1rem' 
  },
  
  viewBtn: {
    marginTop: 'auto',
    padding: '0.9rem',
    background: 'linear-gradient(135deg, #B6771D 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s',
    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
  },
  
  emptyState: { 
    textAlign: 'center', 
    padding: '6rem 2rem',
    maxWidth: '600px',
    margin: '0 auto'
  },
  emptyIcon: { 
    fontSize: '5rem', 
    display: 'block', 
    marginBottom: '1.5rem',
    opacity: 0.6
  },
  emptyTitle: {
    fontSize: '2rem',
    color: '#2d3748',
    marginBottom: '1rem',
    fontWeight: '700'
  },
  emptyText: {
    fontSize: '1.1rem',
    color: '#718096',
    lineHeight: '1.6'
  },
  
  loadingContainer: { 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center', 
    justifyContent: 'center', 
    minHeight: '100vh', 
    gap: '1.5rem',
    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
  },
  spinner: { 
    width: '60px', 
    height: '60px', 
    border: '6px solid #e2e8f0', 
    borderTop: '6px solid #667eea', 
    borderRadius: '50%', 
    animation: 'spin 1s linear infinite' 
  },
  loadingText: {
    fontSize: '1.3rem',
    color: '#4a5568',
    fontWeight: '500'
  }
};

export default RestaurantList;