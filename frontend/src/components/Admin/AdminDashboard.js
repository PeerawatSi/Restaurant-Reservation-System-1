import React, { useState, useEffect } from 'react';
import { getAllUsers, banUser, getAllRestaurantsAdmin, banRestaurant } from '../../services/api';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [activeTab, setActiveTab] = useState('users');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');


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

  const filteredData =
  activeTab === 'users'
    ? users.filter(user => {

        const matchesRole =
          selectedRole === 'all'
            ? user.role.toLowerCase() !== 'admin'
            : user.role.toLowerCase() === selectedRole.toLowerCase();

        const matchesSearch =
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesSearch && matchesRole;
      })
    : restaurants.filter(restaurant =>
        restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restaurant.cuisine_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restaurant.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restaurant.owner_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );


  return (
    <div style={styles.container}>
      <div style={styles.background}>
        <h1 style={styles.title}>Admin Dashboard</h1>

        <div style={styles.tabs}>
          <button onClick={() => setActiveTab('users')} style={activeTab === 'users' ? styles.activeTab : styles.tab}>Users</button>
          <button onClick={() => setActiveTab('restaurants')} style={activeTab === 'restaurants' ? styles.activeTab : styles.tab}>Restaurants</button>
        </div>

        {activeTab === 'users' && (
          <div style={styles.filterContainer}>
            <div style={styles.filterBox}>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                style={styles.roleSelect}
              >
                <option value="all">All Roles</option>
                <option value="user">User</option>
                <option value="owner">Owner</option>

              </select>
            </div>

            <div style={styles.filterBox}>
              <span style={styles.searchIcon}>🔍</span>
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={styles.searchInput}
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} style={styles.clearBtn}>✕</button>
              )}
            </div>
          </div>
        )}

        {activeTab === 'restaurants' && (
          <div style={styles.filterContainer}>
            <div style={styles.filterBox}>
              <span style={styles.searchIcon}>🔍</span>
              <input
                type="text"
                placeholder="Search by restaurant name, cuisine, or owner..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={styles.searchInput}
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} style={styles.clearBtn}>✕</button>
              )}
            </div>
          </div>
        )}




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
                {filteredData.map((user) => (
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
                {filteredData.map((restaurant) => (
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
    </div>
  );
};

const styles = {
  container: { minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' },
  background: {
    maxWidth: '1200px', 
    margin: '0 auto', 
    padding: '2rem',
    background: '#F2F2F2'
  },
  title: { fontSize: '2rem', marginBottom: '2rem' },
  tabs: { display: 'flex', gap: '1rem', marginBottom: '2rem' },
  tab: { padding: '0.75rem 1.5rem', background: 'white', border: '2px solid #ddd', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' },
  activeTab: { padding: '0.75rem 1.5rem', background: 'linear-gradient(135deg, #B6771D 0%, #764ba2 100%)', color: 'white', border: '2px solid #667eea', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' },
  tableContainer: { overflowX: 'auto', background: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { background: '#6B3F69', color: 'white', padding: '1rem', textAlign: 'left', fontWeight: '600' },
  td: { padding: '1rem', borderBottom: '1px solid #eee' },
  roleBadge: { padding: '0.25rem 0.75rem', background: '#667eea', color: 'white', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase' },
  statusBadge: { padding: '0.25rem 0.75rem', borderRadius: '20px', color: 'white', fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase' },
  actionBtn: { padding: '0.5rem 1.5rem', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '600' },
  filterContainer: {
  display: 'flex',
  gap: '1rem',
  marginBottom: '1.5rem',
  flexWrap: 'wrap', 
  },
  filterBox: {
    display: 'flex',
    alignItems: 'center',
    background: 'white',
    border: '2px solid #ddd',
    borderRadius: '8px',
    padding: '0.5rem 1rem',
    minWidth: '200px',
    flex: 1, 
  },
  roleSelect: {
    flex: 1,
    border: 'none',
    outline: 'none',
    fontSize: '1rem',
    color: '#333',
    background: 'transparent',
    cursor: 'pointer',
  },
  searchInput: {
    flex: 1,
    border: 'none',
    outline: 'none',
    fontSize: '1rem',
    color: '#333',
  },
  searchIcon: {
    marginRight: '0.5rem',
    color: '#888',
    fontSize: '1.2rem',
  },
  clearBtn: {
    background: 'transparent',
    border: 'none',
    color: '#999',
    cursor: 'pointer',
    fontSize: '1.2rem',
    marginLeft: '0.25rem',
  },

};

export default AdminDashboard;