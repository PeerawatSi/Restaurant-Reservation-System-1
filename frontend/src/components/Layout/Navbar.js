import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        <Link to="/" style={styles.logo}>🍽️ Restaurant Reservations</Link>
        
        <div style={styles.menu}>
          <Link to="/" style={styles.link}>Restaurants</Link>
          <Link to="/my-reservations" style={styles.link}>My Reservations</Link>
          
          {user?.role === 'owner' && (
            <Link to="/owner/dashboard" style={styles.link}>My Restaurants</Link>
          )}
          
          {user?.role === 'admin' && (
            <Link to="/admin/dashboard" style={styles.link}>Admin Panel</Link>
          )}
          
          <div style={styles.userInfo}>
            <img src={user?.picture} alt={user?.name} style={styles.avatar} />
            <span style={styles.userName}>{user?.name}</span>
            <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
          </div>
        </div>
      </div>
    </nav>
  );
};

const styles = {
  nav: { background: '#667eea', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', position: 'sticky', top: 0, zIndex: 100 },
  container: { maxWidth: '1200px', margin: '0 auto', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  logo: { fontSize: '1.5rem', fontWeight: 'bold', color: 'white', textDecoration: 'none' },
  menu: { display: 'flex', alignItems: 'center', gap: '2rem' },
  link: { color: 'white', textDecoration: 'none', fontWeight: '500', transition: 'opacity 0.3s' },
  userInfo: { display: 'flex', alignItems: 'center', gap: '1rem' },
  avatar: { width: '40px', height: '40px', borderRadius: '50%', border: '2px solid white' },
  userName: { color: 'white', fontWeight: '500' },
  logoutBtn: { background: 'white', color: '#667eea', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' },
};

export default Navbar;