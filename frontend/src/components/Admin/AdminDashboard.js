import React, { useState, useEffect } from 'react';
import { getAllUsers, banUser, getAllRestaurantsAdmin, banRestaurant } from '../../services/api';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [activeTab, setActiveTab] = useState('users');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [usersRes, restaurantsRes] = await Promise.all([
        getAllUsers(),
        getAllRestaurantsAdmin()
      ]);
      setUsers(usersRes.data);
      setRestaurants(restaurantsRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleBanUser = async (userId, isBanned) => {
    try {
      await banUser(userId, !isBanned);
      alert(`User ${!isBanned ? 'banned' : 'unbanned'} successfully!`);
      loadData();
    } catch (error) {
      alert('Failed to update user status');
    }
  };

  const handleBanRestaurant = async (restaurantId, isBanned) => {
    try {
      await banRestaurant(restaurantId, !isBanned);
      alert(`Restaurant ${!isBanned ? 'banned' : 'unbanned'} successfully!`);
      loadData();
    } catch (error) {
      alert('Failed to update restaurant status');
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Admin Dashboard</h1>

      <div style={styles.tabs}>
        <button onClick={() => setActiveTab('users')} style={activeTab === 'users' ? styles.activeTab : styles.tab}>Users ({users.length})</button>
        <button onClick={() => setActiveTab('restaurants')} style={activeTab === 'restaurants' ? styles.activeTab : styles.tab}>Restaurants ({restaurants.length})</button>
      </div>

      {activeTab === 'users' && (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Role</th>
                <th style={styles.th}>Joined</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td style={styles.td}>{user.name}</td>
                  <td style={styles.td}>{user.email}</td>
                  <td style={styles.td}><span style={styles.roleBadge}>{user.role}</span></td>
                  <td style={styles.td}>{new Date(user.created_at).toLocaleDateString()}</td>
                  <td style={styles.td}>
                    <span style={{...styles.statusBadge, background: user.is_banned ? '#dc3545' : '#28a745'}}>
                      {user.is_banned ? 'Banned' : 'Active'}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <button 
                      onClick={() => handleBanUser(user.id, user.is_banned)} 
                      style={{...styles.actionBtn, background: user.is_banned ? '#28a745' : '#dc3545'}}
                    >
                      {user.is_banned ? 'Unban' : 'Ban'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'restaurants' && (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Owner</th>
                <th style={styles.th}>Cuisine</th>
                <th style={styles.th}>Created</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {restaurants.map((restaurant) => (
                <tr key={restaurant.id}>
                  <td style={styles.td}>{restaurant.name}</td>
                  <td style={styles.td}>{restaurant.owner_name}<br/><small>{restaurant.owner_email}</small></td>
                  <td style={styles.td}>{restaurant.cuisine_type}</td>
                  <td style={styles.td}>{new Date(restaurant.created_at).toLocaleDateString()}</td>
                  <td style={styles.td}>
                    <span style={{...styles.statusBadge, background: restaurant.is_banned ? '#dc3545' : '#28a745'}}>
                      {restaurant.is_banned ? 'Banned' : 'Active'}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <button 
                      onClick={() => handleBanRestaurant(restaurant.id, restaurant.is_banned)} 
                      style={{...styles.actionBtn, background: restaurant.is_banned ? '#28a745' : '#dc3545'}}
                    >
                      {restaurant.is_banned ? 'Unban' : 'Ban'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { maxWidth: '1400px', margin: '0 auto', padding: '2rem' },
  title: { fontSize: '2rem', marginBottom: '2rem' },
  tabs: { display: 'flex', gap: '1rem', marginBottom: '2rem' },
  tab: { padding: '0.75rem 1.5rem', background: 'white', border: '2px solid #ddd', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' },
  activeTab: { padding: '0.75rem 1.5rem', background: '#667eea', color: 'white', border: '2px solid #667eea', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' },
  tableContainer: { overflowX: 'auto', background: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { background: '#667eea', color: 'white', padding: '1rem', textAlign: 'left', fontWeight: '600' },
  td: { padding: '1rem', borderBottom: '1px solid #eee' },
  roleBadge: { padding: '0.25rem 0.75rem', background: '#667eea', color: 'white', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase' },
  statusBadge: { padding: '0.25rem 0.75rem', borderRadius: '20px', color: 'white', fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase' },
  actionBtn: { padding: '0.5rem 1.5rem', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '600' },
};

export default AdminDashboard;