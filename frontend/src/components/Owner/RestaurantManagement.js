import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  getRestaurantById, 
  getRestaurantTables, 
  getRestaurantTimeSlots, 
  getRestaurantReservations, 
  createTable, 
  updateTable,
  deleteTable,
  createTimeSlot, 
  updateTimeSlot,
  deleteTimeSlot,
  updateReservationStatus 
} from '../../services/api';

const RestaurantManagement = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [tables, setTables] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [activeTab, setActiveTab] = useState('reservations');
  const [showTableForm, setShowTableForm] = useState(false);
  const [showSlotForm, setShowSlotForm] = useState(false);
  const [editingTable, setEditingTable] = useState(null);
  const [editingSlot, setEditingSlot] = useState(null);

  const [tableForm, setTableForm] = useState({ table_number: '', capacity: 2, is_available: true });
  const [slotForm, setSlotForm] = useState({ slot_time: '12:00', duration_minutes: 60, max_tables: 10, is_active: true });

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const [restaurantRes, tablesRes, timeSlotsRes, reservationsRes] = await Promise.all([
        getRestaurantById(id),
        getRestaurantTables(id),
        getRestaurantTimeSlots(id),
        getRestaurantReservations(id)
      ]);
      setRestaurant(restaurantRes.data);
      setTables(tablesRes.data);
      setTimeSlots(timeSlotsRes.data);
      setReservations(reservationsRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const resetTableForm = () => {
    setTableForm({ table_number: '', capacity: 2, is_available: true });
    setShowTableForm(false);
    setEditingTable(null);
  };

  const resetSlotForm = () => {
    setSlotForm({ slot_time: '12:00', duration_minutes: 60, max_tables: 10, is_active: true });
    setShowSlotForm(false);
    setEditingSlot(null);
  };

  const handleEditTable = (table) => {
    setEditingTable(table.id);
    setTableForm({
      table_number: table.table_number,
      capacity: table.capacity,
      is_available: table.is_available
    });
    setShowTableForm(true);
  };

  const handleEditSlot = (slot) => {
    setEditingSlot(slot.id);
    setSlotForm({
      slot_time: slot.slot_time,
      duration_minutes: slot.duration_minutes,
      max_tables: slot.max_tables,
      is_active: slot.is_active
    });
    setShowSlotForm(true);
  };

  const handleAddTable = async (e) => {
    e.preventDefault();
    try {
      if (editingTable) {
        await updateTable(id, editingTable, tableForm);
        alert('Table updated successfully!');
      } else {
        await createTable(id, tableForm);
        alert('Table added successfully!');
      }
      resetTableForm();
      loadData();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to save table');
    }
  };

  const handleDeleteTable = async (tableId, tableNumber) => {
    if (!window.confirm(`Are you sure you want to delete Table ${tableNumber}? This will affect any reservations using this table.`)) {
      return;
    }
    try {
      await deleteTable(id, tableId);
      alert('Table deleted successfully!');
      loadData();
    } catch (error) {
      alert('Failed to delete table');
    }
  };

  const handleAddTimeSlot = async (e) => {
    e.preventDefault();
    try {
      if (editingSlot) {
        await updateTimeSlot(id, editingSlot, slotForm);
        alert('Time slot updated successfully!');
      } else {
        await createTimeSlot(id, slotForm);
        alert('Time slot added successfully!');
      }
      resetSlotForm();
      loadData();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to save time slot');
    }
  };

  const handleDeleteTimeSlot = async (slotId, slotTime) => {
    if (!window.confirm(`Are you sure you want to delete time slot ${slotTime}? This will affect any reservations using this time.`)) {
      return;
    }
    try {
      await deleteTimeSlot(id, slotId);
      alert('Time slot deleted successfully!');
      loadData();
    } catch (error) {
      alert('Failed to delete time slot');
    }
  };

  const handleStatusChange = async (reservationId, newStatus) => {
    try {
      await updateReservationStatus(reservationId, newStatus);
      alert('Status updated successfully!');
      loadData();
    } catch (error) {
      alert('Failed to update status');
    }
  };

  if (!restaurant) return <div style={styles.loading}>Loading...</div>;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>{restaurant.name}</h1>

      <div style={styles.tabs}>
        <button onClick={() => setActiveTab('reservations')} style={activeTab === 'reservations' ? styles.activeTab : styles.tab}>
          Reservations
        </button>
        <button onClick={() => setActiveTab('tables')} style={activeTab === 'tables' ? styles.activeTab : styles.tab}>
          Tables
        </button>
        <button onClick={() => setActiveTab('timeslots')} style={activeTab === 'timeslots' ? styles.activeTab : styles.tab}>
          Time Slots
        </button>
      </div>

      {activeTab === 'reservations' && (
        <div>
          <h2 style={styles.reservationSection}>All Reservations: {reservations.length}</h2>
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Customer</th>
                  <th style={styles.th}>Date</th>
                  <th style={styles.th}>Time</th>
                  <th style={styles.th}>Table</th>
                  <th style={styles.th}>Guests</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((res) => (
                  <tr key={res.id}>
                    <td style={styles.td}>{res.user_name}<br/><small>{res.user_email}</small></td>
                    <td style={styles.td}>{new Date(res.reservation_date).toLocaleDateString()}</td>
                    <td style={styles.td}>{res.slot_time}</td>
                    <td style={styles.td}>{res.table_number}</td>
                    <td style={styles.td}>{res.guest_count}</td>
                    <td style={styles.td}><span style={{...styles.statusBadge, background: res.status === 'confirmed' ? '#28a745' : '#ffa500'}}>{res.status}</span></td>
                    <td style={styles.td}>
                      {res.status === 'pending' && (
                        <>
                          <button onClick={() => handleStatusChange(res.id, 'confirmed')} style={{...styles.actionBtn, background: '#28a745'}}>Confirm</button>
                          <button onClick={() => handleStatusChange(res.id, 'cancelled')} style={{...styles.actionBtn, background: '#dc3545'}}>Cancel</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'tables' && (
        <div>
          <div style={styles.sectionHeader}>
            <h2>All Tables: {tables.length}</h2>
            <button onClick={() => { resetTableForm(); setShowTableForm(!showTableForm); }} style={styles.addBtn}>
              {showTableForm ? 'Cancel' : '+ Add Table'}
            </button>
          </div>

          {showTableForm && (
            <form onSubmit={handleAddTable} style={styles.form}>
              <h3>{editingTable ? 'Edit Table' : 'Add New Table'}</h3>
              <div style={styles.formRow}>
                <input 
                  type="text" 
                  placeholder="Table Number *"
                  autoComplete="off" 
                  required 
                  value={tableForm.table_number} 
                  onChange={(e) => setTableForm({...tableForm, table_number: e.target.value})} 
                  style={styles.input} 
                />
                <input 
                  type="number" 
                  placeholder="Capacity *" 
                  required 
                  min="1" 
                  value={tableForm.capacity} 
                  onChange={(e) => setTableForm({...tableForm, capacity: e.target.value})} 
                  style={styles.input} 
                />
                <label style={styles.checkboxLabel}>
                  <input 
                    type="checkbox" 
                    checked={tableForm.is_available}
                    onChange={(e) => setTableForm({...tableForm, is_available: e.target.checked})}
                    style={styles.checkbox}
                  />
                  <span>Available</span>
                </label>
              </div>
              <button type="submit" style={styles.submitBtn}>
                {editingTable ? 'Update Table' : 'Add Table'}
              </button>
            </form>
          )}

          <div style={styles.grid}>
            {tables.map((table) => (
              <div key={table.id} style={styles.card}>
                <div style={styles.cardHeader}>
                  <h3>Table {table.table_number}</h3>
                  <span style={{...styles.badge, background: table.is_available ? '#28a745' : '#dc3545'}}>
                    {table.is_available ? 'Available' : 'Unavailable'}
                  </span>
                </div>
                <p style={styles.cardInfo}>👥 Capacity: {table.capacity} guests</p>
                <div style={styles.cardActions}>
                  <button onClick={() => handleEditTable(table)} style={styles.editBtn}>✏️ Edit</button>
                  <button onClick={() => handleDeleteTable(table.id, table.table_number)} style={styles.deleteBtn}>🗑️ Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'timeslots' && (
        <div>
          <div style={styles.sectionHeader}>
            <h2>All Time Slots: {timeSlots.length}</h2>
            <button onClick={() => { resetSlotForm(); setShowSlotForm(!showSlotForm); }} style={styles.addBtn}>
              {showSlotForm ? 'Cancel' : '+ Add Time Slot'}
            </button>
          </div>

          {showSlotForm && (
            <form onSubmit={handleAddTimeSlot} style={styles.form}>
              <h3>{editingSlot ? 'Edit Time Slot' : 'Add New Time Slot'}</h3>
              <div style={styles.formRow}>
                <input 
                  type="time" 
                  required 
                  value={slotForm.slot_time} 
                  onChange={(e) => setSlotForm({...slotForm, slot_time: e.target.value})} 
                  style={styles.input} 
                />
                <input 
                  type="number" 
                  placeholder="Duration (minutes)" 
                  required 
                  value={slotForm.duration_minutes} 
                  onChange={(e) => setSlotForm({...slotForm, duration_minutes: e.target.value})} 
                  style={styles.input} 
                />
                <input 
                  type="number" 
                  placeholder="Max Tables" 
                  required 
                  value={slotForm.max_tables} 
                  onChange={(e) => setSlotForm({...slotForm, max_tables: e.target.value})} 
                  style={styles.input} 
                />
                <label style={styles.checkboxLabel}>
                  <input 
                    type="checkbox" 
                    checked={slotForm.is_active}
                    onChange={(e) => setSlotForm({...slotForm, is_active: e.target.checked})}
                    style={styles.checkbox}
                  />
                  <span>Active</span>
                </label>
              </div>
              <button type="submit" style={styles.submitBtn}>
                {editingSlot ? 'Update Time Slot' : 'Add Time Slot'}
              </button>
            </form>
          )}

          <div style={styles.grid}>
            {timeSlots.map((slot) => (
              <div key={slot.id} style={styles.card}>
                <div style={styles.cardHeader}>
                  <h3>🕒 {slot.slot_time}</h3>
                  <span style={{...styles.badge, background: slot.is_active ? '#28a745' : '#dc3545'}}>
                    {slot.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p style={styles.cardInfo}>⏱️ Duration: {slot.duration_minutes} minutes</p>
                <p style={styles.cardInfo}>🪑 Max Tables: {slot.max_tables}</p>
                <div style={styles.cardActions}>
                  <button onClick={() => handleEditSlot(slot)} style={styles.editBtn}>✏️ Edit</button>
                  <button onClick={() => handleDeleteTimeSlot(slot.id, slot.slot_time)} style={styles.deleteBtn}>🗑️ Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { maxWidth: '1200px', margin: '0 auto', padding: '2rem' },
  title: { fontSize: '2rem', marginBottom: '2rem' },
  tabs: { display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' },
  tab: { padding: '0.75rem 1.5rem', background: 'white', border: '2px solid #ddd', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', transition: 'all 0.3s' },
  activeTab: { padding: '0.75rem 1.5rem', background: 'linear-gradient(135deg, #B6771D 0%, #764ba2 100%)', color: 'white', border: '2px solid #667eea', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' },
  sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' },
  addBtn: { padding: '0.75rem 1.5rem', background: '#28a745', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' },
  form: { background: 'white', padding: '2rem', borderRadius: '12px', marginBottom: '2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
  formRow: { display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' },
  input: { flex: 1, minWidth: '150px', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '6px' },
  checkboxLabel: { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', fontSize: '1rem', fontWeight: '500' },
  checkbox: { width: '20px', height: '20px', cursor: 'pointer' },
  submitBtn: { padding: '0.75rem 2rem', background: '#667eea', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', marginTop: '1rem' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' },
  card: { background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' },
  badge: { padding: '0.25rem 0.75rem', borderRadius: '20px', color: 'white', fontSize: '0.85rem', fontWeight: '600' },
  cardInfo: { marginBottom: '0.5rem', color: '#4a5568' },
  cardActions: { display: 'flex', gap: '0.5rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' },
  editBtn: { flex: 1, padding: '0.6rem', background: '#667eea', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem' },
  deleteBtn: { flex: 1, padding: '0.6rem', background: '#dc3545', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem' },
  tableContainer: { overflowX: 'auto' },
  table: { width: '100%', background: 'white', borderCollapse: 'collapse', borderRadius: '12px', overflow: 'hidden' },
  th: { background: '#6B3F69', color: 'white', padding: '1rem', textAlign: 'left', fontWeight: '600' },
  td: { padding: '1rem', borderBottom: '1px solid #eee' },
  statusBadge: { padding: '0.25rem 0.75rem', borderRadius: '20px', color: 'white', fontSize: '0.85rem', fontWeight: '600' },
  actionBtn: { padding: '0.5rem 1rem', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '0.5rem', fontSize: '0.85rem' },
  loading: { textAlign: 'center', padding: '4rem', fontSize: '1.2rem' },
  reservationSection: {
    paddingBottom: '1.2rem'
  }
};

export default RestaurantManagement;